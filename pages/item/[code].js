import supabase from '../../lib/supabase'

export async function getServerSideProps(context) {

  const { code } = context.params

  const { data } = await supabase
    .from('items')
    .select('*')
    .eq('item_code', code)
    .single()

  return { props: { item: data } }
}

export default function Item({ item }) {

  if(!item){
    return <h1>Item not found</h1>
  }

  return (
    <div style={{textAlign:"center"}}>
      <h2>This item belongs to someone</h2>

      <p>
        Please surrender to SCHOOL SAO OFFICE
      </p>

      <h3>Item ID: {item.item_code}</h3>
    </div>
  )
}