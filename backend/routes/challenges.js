import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const router = Router()

const getUserId = (req) => req.user?.id || req.user?.userId
const getUserName = (req) => req.user?.name || 'User'

router.get('/', async (req, res) => {
  try {
    const tasks = await prisma.challenge.findMany({
      include: { members: true, tags: true }
    })
    res.status(200).json(tasks)
  } catch (error) {
    console.error('Failed to load tasks:', error)
    res.status(500).json({ message: 'Unable to load tasks' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const challenge = await prisma.challenge.findUnique({
      where: { id: req.params.id },
      include: { members: true, tags: true }
    })

    if (!challenge) {
      return res.status(404).json({ message: 'Task not found' })
    }

    res.status(200).json(challenge)
  } catch (error) {
    console.error('Failed to load challenge:', error)
    res.status(500).json({ message: 'Unable to load challenge' })
  }
})

router.post('/:id', async (req, res) => {
  try {
    const userId = getUserId(req)
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const data = req.body
    if (!data || !data.name) {
      return res.status(400).json({ message: 'Task title is required' })
    }

    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId, name: getUserName(req) }
    })

    const tagOps = (data.tags || []).map((name) => ({
      where: { name },
      create: { name }
    }))

    const newChallenge = await prisma.challenge.create({
      data: {
        id: req.params.id,
        name: data.name,
        description: data.description || '',
        duration: data.duration || '',
        category: data.category || '',
        penalties: data.penalties || '',
        strikeLostIf: data.strikeLostIf || '',
        isPrivate: Boolean(data.isPrivate),
        approved: true,
        dueToday: Boolean(data.dueToday),
        members: { connect: [{ id: userId }] },
        tags: tagOps.length ? { connectOrCreate: tagOps } : undefined
      },
      include: { members: true, tags: true }
    })

    res.status(201).json(newChallenge)
  } catch (error) {
    console.error('Failed to create challenge:', error)
    res.status(500).json({ message: 'Unable to create challenge' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const userId = getUserId(req)
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const data = req.body
    if (!data) {
      return res.status(400).json({ message: 'Update data is required' })
    }

    const existing = await prisma.challenge.findUnique({ where: { id: req.params.id } })
    if (!existing) {
      return res.status(404).json({ message: 'Task not found' })
    }

    const updated = await prisma.challenge.update({
      where: { id: req.params.id },
      data: {
        name: data.name ?? existing.name,
        description: data.description ?? existing.description,
        duration: data.duration ?? existing.duration,
        category: data.category ?? existing.category,
        penalties: data.penalties ?? existing.penalties,
        strikeLostIf: data.strikeLostIf ?? existing.strikeLostIf,
        isPrivate: data.isPrivate ?? existing.isPrivate,
        approved: data.approved ?? existing.approved,
        dueToday: data.dueToday ?? existing.dueToday,
        tags: data.tags ? { connectOrCreate: (data.tags || []).map((name) => ({ where: { name }, create: { name } })) } : undefined
      },
      include: { members: true, tags: true }
    })

    res.status(200).json(updated)
  } catch (error) {
    console.error('Failed to update challenge:', error)
    res.status(500).json({ message: 'Unable to update challenge' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const existing = await prisma.challenge.findUnique({ where: { id: req.params.id } })
    if (!existing) {
      return res.status(404).json({ message: 'Task not found' })
    }

    await prisma.challenge.delete({ where: { id: req.params.id } })
    const tasks = await prisma.challenge.findMany({ include: { members: true, tags: true } })
    res.status(200).json(tasks)
  } catch (error) {
    console.error('Failed to delete challenge:', error)
    res.status(500).json({ message: 'Unable to delete challenge' })
  }
})

router.post('/', async (req, res) => {
  try {
    const userId = getUserId(req)
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const data = req.body
    if (!data || !data.name) {
      return res.status(400).json({ message: 'Task title is required' })
    }

    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId, name: getUserName(req) }
    })

    const tagOps = (data.tags || []).map((name) => ({
      where: { name },
      create: { name }
    }))

    const newChallenge = await prisma.challenge.create({
      data: {
        name: data.name,
        description: data.description || '',
        duration: data.duration || '',
        category: data.category || '',
        penalties: data.penalties || '',
        strikeLostIf: data.strikeLostIf || '',
        isPrivate: Boolean(data.isPrivate),
        approved: true,
        dueToday: Boolean(data.dueToday),
        members: { connect: [{ id: userId }] },
        tags: tagOps.length ? { connectOrCreate: tagOps } : undefined
      },
      include: { members: true, tags: true }
    })

    res.status(201).json(newChallenge)
  } catch (error) {
    console.error('Failed to create challenge:', error)
    res.status(500).json({ message: 'Unable to create challenge' })
  }
})

router.post('/:id/join', async (req, res) => {
  try {
    const userId = getUserId(req)
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId, name: getUserName(req) }
    })

    const challenge = await prisma.challenge.findUnique({
      where: { id: req.params.id },
      include: { members: true }
    })

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' })
    }

    if (challenge.members.some((member) => member.id === userId)) {
      return res.status(409).json({ message: 'Already a member' })
    }

    if (challenge.isPrivate) {
      return res.status(202).json({ message: 'Join request sent. Waiting for approval.' })
    }

    const updated = await prisma.challenge.update({
      where: { id: req.params.id },
      data: { members: { connect: { id: userId } } },
      include: { members: true, tags: true }
    })

    return res.status(200).json({ message: 'Joined challenge', challenge: updated })
  } catch (error) {
    console.error('Failed to join challenge:', error)
    res.status(500).json({ message: 'Unable to join challenge' })
  }
})

router.get('/:id/posts', async (req, res) => {
  try {
    const challengePosts = await prisma.post.findMany({
      where: { challengeId: req.params.id }
    })
    res.status(200).json(challengePosts)
  } catch (error) {
    console.error('Failed to load challenge posts:', error)
    res.status(500).json({ message: 'Unable to load challenge posts' })
  }
})

router.post('/:id/posts', async (req, res) => {
  try {
    const userId = getUserId(req)
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const challenge = await prisma.challenge.findUnique({ where: { id: req.params.id } })
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' })
    }

    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId, name: getUserName(req) }
    })

    const newPost = await prisma.post.create({
      data: {
        challenge: { connect: { id: req.params.id } },
        author: { connect: { id: userId } },
        type: req.body.type || 'note',
        message: req.body.message || '',
        publishedToProfile: Boolean(req.body.publishedToProfile)
      }
    })

    res.status(201).json(newPost)
  } catch (error) {
    console.error('Failed to create challenge post:', error)
    res.status(500).json({ message: 'Unable to create challenge post' })
  }
})

export default router
