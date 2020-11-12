import orm from '../orm'

import { loadManifestSuccess } from '../actions/content'

const boxes = {
  section01: [
    ['info-1.1.1', '1.1.1', 'info'],
    ['EX_01', '1.1.2', 'exercise', 4, 2],
  ],
  'section01/02': [
    ['EX_02', '1.2.1', 'exercise', 2, 1],
    ['EX_03', '1.2.2', 'exercise', 6, 3],
  ],
}

const loadExercises = (state) => {
  const session = orm.session(state)
  session.Exercise.create({
    id: 'section01#EX_01',
    number: '1.1.2',
    sectionId: 'section01',
    points: 4,
    questionCount: 2,
  })
  session.Exercise.create({
    id: 'section01/02#EX_02',
    number: '1.2.1',
    sectionId: 'section01/02',
    points: 2,
    questionCount: 1,
  })
  session.Exercise.create({
    id: 'section01/02#EX_03',
    number: '1.2.2',
    sectionId: 'section01/02',
    points: 6,
    questionCount: 3,
  })
  return session.state
}

describe('Exercise', () => {
  let session
  let loadedExercises

  beforeEach(() => {
    session = orm.session(orm.getEmptyState())
    loadedExercises = loadExercises(session.state)
  })

  it('should instantiate', () => {
    session.Exercise.create({})
    expect(session.Exercise.all().count()).toEqual(1)
  })

  describe('reducer', () => {
    test('loadManifestSuccess', () => {
      session.Exercise.reducer(loadManifestSuccess({ content: { boxes } }), session.Exercise)
      expect(session.state).toEqual(loadedExercises)
    })

    test('no-op action', () => {
      session.Exercise.reducer({ type: 'DOES-NOT-EXIST' }, session.Exercise)
    })
  })
})
