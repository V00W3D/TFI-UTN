import { conductor } from '@tools/conductor';
import { RegisterContract } from '@shared/contracts/RegisterContract';
import { registerService } from '../services/register';

export default conductor(RegisterContract, async (input) => {
  await registerService(input);
  return;
});
