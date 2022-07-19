export default function* hydrateSaga({ payload }) {
  console.log('hydrateSaga', payload.orm.Page.itemsById)
}
