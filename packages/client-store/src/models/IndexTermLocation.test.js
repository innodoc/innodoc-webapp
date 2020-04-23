import orm from '../orm'

describe('IndexTermLocation', () => {
  it('should instantiate', () => {
    const session = orm.session(orm.getEmptyState())
    session.IndexTermLocation.create({})
    expect(session.IndexTermLocation.all().count()).toEqual(1)
  })

  test('getContentId()', () => {
    const session = orm.session(orm.getEmptyState())
    session.Section.create({ id: 'section-0/subsection-1' })
    const indexTermLoc = session.IndexTermLocation.create({
      id: 'foo',
      anchorId: 'foo-0',
      indexTermId: 'foo',
      language: 'en',
      sectionId: 'section-0/subsection-1',
    })
    expect(indexTermLoc.getContentId()).toEqual(
      'section-0/subsection-1#index-term-foo-0'
    )
  })
})
