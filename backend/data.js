const users = [
  { id: 'current', name: 'Du', friends: ['user2', 'user3'], challenges: ['c1', 'c2'], isCurrentUser: true },
  { id: 'user2', name: 'Mia', friends: ['current'], challenges: ['c2'] },
  { id: 'user3', name: 'Luca', friends: ['current'], challenges: ['c3'] }
]

const challenges = [
  {
    id: 'c1',
    name: 'Gym Photo Challenge',
    description: 'Post mindestens 5 Fotos pro Woche aus dem Gym, um den Strike zu behalten.',
    duration: '4 weeks',
    category: 'Fitness',
    penalties: 'Strike bei fehlender wöchentlicher Abgabe',
    strikeLostIf: 'Ein Mitglied verpasst einen Pflicht-Post',
    tags: ['gym', 'weekly', 'accountability'],
    isPrivate: false,
    approved: true,
    members: ['current', 'user2'],
    dueToday: true
  },
  {
    id: 'c2',
    name: 'Study Sprint',
    description: 'Poste jeden Tag deine Lernfortschritte mit Screenshots oder Notizen.',
    duration: '2 weeks',
    category: 'Study',
    penalties: 'Strike wenn ein Tag fehlt',
    strikeLostIf: 'Mindestens ein Mitglied vergisst den täglichen Post',
    tags: ['study', 'focus', 'community'],
    isPrivate: true,
    approved: false,
    members: ['current', 'user2'],
    dueToday: false
  },
  {
    id: 'c3',
    name: 'Wellness Self-Care',
    description: 'Ein Challenge-Bereich für Self-Care-Fotos, Notes und Dateien.',
    duration: 'Ongoing',
    category: 'Wellness',
    penalties: 'Verlust eines Strikes bei verpasstem Nachweis',
    strikeLostIf: 'Wenn ein Mitglied in einer Woche keinen Nachweis teilt',
    tags: ['wellness', 'selfcare', 'mindset'],
    isPrivate: false,
    approved: true,
    members: ['user3'],
    dueToday: true
  }
]

const posts = [
  { id: 'p1', challengeId: 'c1', authorId: 'current', type: 'photo', message: 'Gym session mit 5 Fotos hochgeladen.', createdAt: new Date().toISOString(), publishedToProfile: true },
  { id: 'p2', challengeId: 'c1', authorId: 'user2', type: 'note', message: 'Heute Beine trainiert.', createdAt: new Date().toISOString(), publishedToProfile: false },
  { id: 'p3', challengeId: 'c3', authorId: 'user3', type: 'file', message: 'Mood tracker Screenshot angehängt.', createdAt: new Date().toISOString(), publishedToProfile: true }
]

export { users, challenges, posts }
