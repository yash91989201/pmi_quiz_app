export default function Page({ params }: { params: { userId: string } }) {
  return <div>My Post: {params.userId}</div>;
}
