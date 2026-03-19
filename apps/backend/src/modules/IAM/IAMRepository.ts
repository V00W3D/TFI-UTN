import { prisma } from '@tools/db';
import type { UserRole, CustomerTier, StaffPost, AuthorityRank } from 'prisma/generated/client';
import type { InferRequest } from '@app/sdk';
import type { RegisterContract } from '@app/contracts';

//#region REPOSITORY_TYPES
/** @internal Raw user row — includes hashed password. Never expose outside the auth flow. */
export type UserForAuth = {
  id: string;
  username: string;
  email: string;
  phone: string | null;
  password: string;
  role: UserRole;
};

/** @public Safe user shape — password excluded. Safe for JWT payloads and API responses. */
export type AuthenticatedUser = Omit<UserForAuth, 'password'>;

/**
 * @public Sub-profile shape — only the field matching the user's `role` is populated.
 * Uses exact Prisma enum types so IAMService return values are assignable to
 * the contract's ZodEnum output types without casts.
 *
 * Note: optional fields typed as `T` (not `T | undefined`) because
 * `exactOptionalPropertyTypes: true` treats `prop?: T` as "absent OR T", not "absent OR T | undefined".
 * Conditional spread in `findUserWithProfile` ensures the field is only present when populated.
 */
export type UserProfile = {
  tier?: CustomerTier;
  post?: StaffPost;
  rank?: AuthorityRank;
};

/** @public Full user response — user + sub-profile combined. */
export type AuthenticatedUserWithProfile = AuthenticatedUser & { profile: UserProfile };

/**
 * @internal Input for {@link IAMRepository.createCustomer}.
 * Derived from RegisterContract:
 *   - `cpassword` removed (validated + discarded in the service)
 *   - `password` overridden to `string` (already hashed by the service)
 */
export type CreateUserInput = Omit<
  InferRequest<typeof RegisterContract>,
  'cpassword' | 'password'
> & { password: string };
//#endregion

//#region PREPARED_QUERIES
/** @public All database access for the IAM module — services never call `prisma` directly. */
export const IAMRepository = {
  /** Looks up a user by username, email, or phone. Returns the row including hashed password. */
  async findUserByIdentity(identity: string): Promise<UserForAuth | null> {
    return prisma.user.findFirst({
      where: { OR: [{ username: identity }, { email: identity }, { phone: identity }] },
      select: { id: true, username: true, email: true, phone: true, password: true, role: true },
    });
  },

  /**
   * Fetches a user by ID with their sub-profile.
   * Only the relation matching the user's role is populated.
   *
   * Uses conditional spread `...(rel && { field: rel.field })` instead of
   * `field: rel?.field` because `exactOptionalPropertyTypes: true` disallows
   * assigning `undefined` to an optional property typed as just `T`.
   */
  async findUserWithProfile(id: string): Promise<AuthenticatedUserWithProfile | null> {
    const row = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        role: true,
        customer: { select: { tier: true } },
        staff: { select: { post: true } },
        authority: { select: { rank: true } },
      },
    });

    if (!row) return null;

    // Conditional spread — each field is only added to the object when the relation exists.
    // This satisfies exactOptionalPropertyTypes: fields are absent, not `undefined`.
    const profile: UserProfile = {
      ...(row.customer && { tier: row.customer.tier }),
      ...(row.staff && { post: row.staff.post }),
      ...(row.authority && { rank: row.authority.rank }),
    };

    return {
      id: row.id,
      username: row.username,
      email: row.email,
      phone: row.phone,
      role: row.role,
      profile,
    };
  },

  /**
   * Creates a User + CustomerProfile (tier: REGULAR) in a single transaction.
   * The `password` in `data` must already be hashed (argon2id).
   */
  async createCustomer(data: CreateUserInput): Promise<{ id: string; role: UserRole }> {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: data.name,
          sname: data.sname,
          lname: data.lname,
          sex: data.sex as never, // Prisma enum = same string union as contract — safe cast
          username: data.username,
          email: data.email,
          phone: data.phone,
          password: data.password,
        },
        select: { id: true, role: true },
      });

      await tx.customerProfile.create({ data: { userId: user.id } });

      return user;
    });
  },

  /** Returns `true` when at least one of the provided unique fields already exists. */
  async isIdentityTaken(fields: {
    username?: string;
    email?: string;
    phone?: string;
  }): Promise<boolean> {
    const conditions = [
      fields.username ? { username: fields.username } : undefined,
      fields.email ? { email: fields.email } : undefined,
      fields.phone ? { phone: fields.phone } : undefined,
    ].filter((c): c is NonNullable<typeof c> => c !== undefined);

    if (!conditions.length) return false;

    const count = await prisma.user.count({ where: { OR: conditions } });
    return count > 0;
  },
} as const;
//#endregion
