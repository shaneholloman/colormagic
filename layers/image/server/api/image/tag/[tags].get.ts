export default defineEventHandler(async (event) => {
  const params = await modules.image.validation.getTagParams(event);
  const query = await modules.image.validation.getByTagQuery(event);

  const options = query?.width !== undefined && query?.height !== undefined
    ? {
        width: parseInt(query.width),
        height: parseInt(query.height)
      }
    : undefined;

  const response = await modules.image.service.generateByTags(
    params.tags.toLowerCase().split('-'),
    options
  );

  setResponseHeader(event, 'Content-Type', 'image/png');

  return response;
});
