import { api } from '@tools/api';
import {
  getPlatesService,
  getPlateService,
  createPlateService,
  updatePlateService,
  patchPlateService,
  deletePlateService,
  getMyReviewsService,
  getReviewService,
  createReviewService,
  patchReviewService,
  deleteReviewService,
  getIngredientsService,
  getIngredientService,
  createIngredientService,
  updateIngredientService,
  patchIngredientService,
  deleteIngredientService,
  getTagsService,
  getTagService,
  proposeTagService,
  patchTagService,
  deleteTagService,
} from './CUSTOMERService';

//#region PLATE HANDLERS
const GetPlatesHandler = api.handler('GET /customer/plates')(async (input) => {
  return getPlatesService(input);
});

const GetPlateHandler = api.handler('GET /customer/plate')(async (input) => {
  return getPlateService(input);
});

const CreatePlateHandler = api.handler('POST /customer/plate')(async (input, ctx) => {
  await createPlateService(input, ctx);
});

const UpdatePlateHandler = api.handler('PUT /customer/plate')(async (input, ctx) => {
  await updatePlateService(input, ctx);
});

const PatchPlateHandler = api.handler('PATCH /customer/plate')(async (input, ctx) => {
  await patchPlateService(input, ctx);
});

const DeletePlateHandler = api.handler('DELETE /customer/plate')(async (input, ctx) => {
  await deletePlateService(input, ctx);
});
//#endregion

//#region REVIEW HANDLERS
const GetMyReviewsHandler = api.handler('GET /customer/reviews')(async (input, ctx) => {
  return getMyReviewsService(input, ctx);
});

const GetReviewHandler = api.handler('GET /customer/review')(async (input, ctx) => {
  return getReviewService(input, ctx);
});

const CreateReviewHandler = api.handler('POST /customer/review')(async (input, ctx) => {
  await createReviewService(input, ctx);
});

const PatchReviewHandler = api.handler('PATCH /customer/review')(async (input, ctx) => {
  await patchReviewService(input, ctx);
});

const DeleteReviewHandler = api.handler('DELETE /customer/review')(async (input, ctx) => {
  await deleteReviewService(input, ctx);
});
//#endregion

//#region INGREDIENT HANDLERS
const GetIngredientsHandler = api.handler('GET /customer/ingredients')(async (input) => {
  return getIngredientsService(input);
});

const GetIngredientHandler = api.handler('GET /customer/ingredient')(async (input) => {
  return getIngredientService(input);
});

const CreateIngredientHandler = api.handler('POST /customer/ingredient')(async (input) => {
  await createIngredientService(input);
});

const UpdateIngredientHandler = api.handler('PUT /customer/ingredient')(async (input) => {
  await updateIngredientService(input);
});

const PatchIngredientHandler = api.handler('PATCH /customer/ingredient')(async (input) => {
  await patchIngredientService(input);
});

const DeleteIngredientHandler = api.handler('DELETE /customer/ingredient')(async (input) => {
  await deleteIngredientService(input);
});
//#endregion

//#region TAG HANDLERS
const GetTagsHandler = api.handler('GET /customer/tags')(async (input) => {
  return getTagsService(input);
});

const GetTagHandler = api.handler('GET /customer/tag')(async (input) => {
  return getTagService(input);
});

const ProposeTagHandler = api.handler('POST /customer/tag')(async (input, ctx) => {
  await proposeTagService(input, ctx);
});

const PatchTagHandler = api.handler('PATCH /customer/tag')(async (input, ctx) => {
  await patchTagService(input, ctx);
});

const DeleteTagHandler = api.handler('DELETE /customer/tag')(async (input, ctx) => {
  await deleteTagService(input, ctx);
});
//#endregion

//#region ROUTER
export const CUSTOMERRouter = api.router([
  // Plates
  GetPlatesHandler,
  GetPlateHandler,
  CreatePlateHandler,
  UpdatePlateHandler,
  PatchPlateHandler,
  DeletePlateHandler,
  // Reviews
  GetMyReviewsHandler,
  GetReviewHandler,
  CreateReviewHandler,
  PatchReviewHandler,
  DeleteReviewHandler,
  // Ingredients
  GetIngredientsHandler,
  GetIngredientHandler,
  CreateIngredientHandler,
  UpdateIngredientHandler,
  PatchIngredientHandler,
  DeleteIngredientHandler,
  // Tags
  GetTagsHandler,
  GetTagHandler,
  ProposeTagHandler,
  PatchTagHandler,
  DeleteTagHandler,
]);
//#endregion
