import CategoryPage from './[category]/page'

export default async function Home() {
  return <CategoryPage params={{ category: 'saladas' }} />
}
