/**
 * @see https://umijs.org/docs/max/access#access
 * */
export default function access(
  initialState: { currentUser?: { name?: string } } | undefined,
) {
  const { currentUser } = initialState ?? {};
  return {
    canAdmin: !!currentUser,
  };
}
