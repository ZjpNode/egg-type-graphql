export default async function upperCase(resolve: any) {
  const value = await resolve()
  return value.toString().toUpperCase()
}
