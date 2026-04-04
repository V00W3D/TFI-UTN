import type { InferRequest, InferSuccess } from '@app/sdk';
import type { UpdateMeContract } from '@app/contracts';
import { prisma } from '../../../tools/db';

export async function updateMeService(
  userId: string,
  input: InferRequest<typeof UpdateMeContract>,
): Promise<InferSuccess<typeof UpdateMeContract>> {
  const cleanInput = Object.fromEntries(Object.entries(input).filter(([_, v]) => v !== undefined));

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: cleanInput,
    include: {
      customer: { select: { tier: true } },
      staff: { select: { post: true } },
      authority: { select: { rank: true } },
    },
  });

  return {
    id: updatedUser.id,
    username: updatedUser.username,
    name: updatedUser.name,
    sname: updatedUser.sname ?? null,
    lname: updatedUser.lname,
    sex: updatedUser.sex,
    email: updatedUser.email,
    emailVerified: !!updatedUser.emailVerified,
    phone: updatedUser.phone ?? null,
    phoneVerified: !!updatedUser.phoneVerified,
    role: updatedUser.role,
    profile: {
      ...(updatedUser.customer?.tier ? { tier: updatedUser.customer.tier } : {}),
      ...(updatedUser.staff?.post ? { post: updatedUser.staff.post } : {}),
      ...(updatedUser.authority?.rank ? { rank: updatedUser.authority.rank } : {}),
    },
  };
}
