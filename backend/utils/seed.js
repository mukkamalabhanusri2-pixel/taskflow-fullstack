/**
 * Database Seed Script
 * Creates a demo user and sample tasks for testing
 * Run: npm run seed
 */

const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();

const User = require('../models/User');
const Task = require('../models/Task');
const connectDB = require('../config/db');

const sampleTasks = [
  {
    title: 'Design new landing page mockups',
    description: 'Create wireframes and high-fidelity mockups for the new product landing page. Include mobile and desktop versions.',
    status: 'in-progress',
    priority: 'high',
    category: 'Design',
    tags: ['design', 'ui', 'mockup'],
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
  },
  {
    title: 'Set up CI/CD pipeline',
    description: 'Configure GitHub Actions for automated testing and deployment to production server.',
    status: 'pending',
    priority: 'high',
    category: 'DevOps',
    tags: ['devops', 'automation', 'github'],
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Write API documentation',
    description: 'Document all REST API endpoints using Swagger/OpenAPI specification.',
    status: 'pending',
    priority: 'medium',
    category: 'Documentation',
    tags: ['docs', 'api', 'swagger'],
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Fix login page mobile responsiveness',
    description: 'The login form breaks on screens smaller than 375px. Needs CSS fix.',
    status: 'completed',
    priority: 'high',
    category: 'Bug Fix',
    tags: ['bug', 'mobile', 'css'],
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Implement JWT refresh tokens',
    description: 'Add refresh token functionality to extend user sessions without requiring re-login.',
    status: 'pending',
    priority: 'medium',
    category: 'Backend',
    tags: ['security', 'jwt', 'auth'],
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Code review - Payment module',
    description: 'Review and approve pull request #47 for the new Stripe payment integration.',
    status: 'in-progress',
    priority: 'high',
    category: 'Review',
    tags: ['code-review', 'payments', 'stripe'],
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Database performance optimization',
    description: 'Analyze slow queries and add proper indexes to MongoDB collections.',
    status: 'pending',
    priority: 'medium',
    category: 'Backend',
    tags: ['database', 'performance', 'mongodb'],
  },
  {
    title: 'User onboarding email sequence',
    description: 'Design and set up 5-email welcome sequence for new users using Mailchimp.',
    status: 'completed',
    priority: 'low',
    category: 'Marketing',
    tags: ['email', 'marketing', 'onboarding'],
  },
  {
    title: 'Q4 product roadmap planning',
    description: 'Compile feature requests, prioritize backlog, and create Q4 development roadmap.',
    status: 'in-progress',
    priority: 'high',
    category: 'Planning',
    tags: ['planning', 'roadmap', 'strategy'],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Update npm dependencies',
    description: 'Run npm audit and update outdated packages. Test for breaking changes.',
    status: 'pending',
    priority: 'low',
    category: 'Maintenance',
    tags: ['maintenance', 'dependencies'],
  },
];

const seed = async () => {
  try {
    await connectDB();
    console.log('🌱 Starting database seed...');

    // Clear existing data
    await User.deleteMany({});
    await Task.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create demo user
    const demoUser = await User.create({
      name: 'Alex Johnson',
      email: 'demo@taskflow.com',
      password: 'demo1234',
      role: 'user',
    });
    console.log(`👤 Created demo user: ${demoUser.email}`);

    // Create tasks for demo user
    const tasksWithUser = sampleTasks.map((task) => ({
      ...task,
      user: demoUser._id,
    }));

    await Task.insertMany(tasksWithUser);
    console.log(`✅ Created ${sampleTasks.length} sample tasks`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('📧 Demo login: demo@taskflow.com');
    console.log('🔑 Demo password: demo1234\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seed();
