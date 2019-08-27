import orm from '../orm'

describe('IndexTermLocation', () => {
  it('should instantiate', () => {
    const session = orm.session(orm.getEmptyState())
    session.IndexTermLocation.create({})
    expect(session.IndexTermLocation.all().count()).toEqual(1)
  })
})
