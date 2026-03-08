import type { Request, Response } from 'express';
import type { Contract, ContractInput } from '@contracts/ContractFactory';

/* ============================================================
   FLUX FACTORY
============================================================ */

export function Flux<T extends Contract<any, any>>(contract: T) {
  type Input = ContractInput<T>;

  return {
    service<O>(serviceFn: (input: Input) => Promise<O>) {
      return {
        exec: serviceFn,

        controller(
          controllerFn: (ctx: {
            input: Input;
            req: Request;
            res: Response;
            service: () => Promise<O>;
          }) => Promise<unknown>,
        ) {
          return async (req: Request, res: Response): Promise<void> => {
            try {
              /* ---------------------------
                 INPUT VALIDATION
              ---------------------------- */

              const parsed = await contract.I.safeParseAsync(req.body);

              if (!parsed.success) {
                const error = contract.E.parse({
                  ok: false,
                  message: 'Datos inválidos',
                });

                res.status(400).json(error);
                return;
              }

              /* ---------------------------
                 SERVICE WRAPPER
              ---------------------------- */

              const runService = () => serviceFn(parsed.data);

              /* ---------------------------
                 CONTROLLER EXECUTION
              ---------------------------- */

              const data = await controllerFn({
                input: parsed.data,
                req,
                res,
                service: runService,
              });

              /* ---------------------------
                 SUCCESS RESPONSE
              ---------------------------- */

              const success = contract.O.parse({
                ok: true,
                message: 'OK',
                data,
              });

              res.status(200).json(success);
            } catch (err: unknown) {
              console.error(err);

              /* ---------------------------
                 DOMAIN ERROR
              ---------------------------- */

              if (err instanceof Error) {
                const error = contract.E.parse({
                  ok: false,
                  message: err.message,
                });

                res.status(400).json(error);
                return;
              }

              /* ---------------------------
                 INTERNAL ERROR
              ---------------------------- */

              const internal = contract.E.parse({
                ok: false,
                message: 'Ha ocurrido un error inesperado',
              });

              res.status(500).json(internal);
            }
          };
        },
      };
    },
  };
}
