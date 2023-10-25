export default function Dish({ params }: { params: { slug: string } }) {
  return (
    <div>
      <h1>Dish: {params.slug}</h1>
    </div>
  )
}
