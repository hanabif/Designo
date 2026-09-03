import { Difficulty, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const questions = [
  {
    title: 'TinyURL',
    difficulty: Difficulty.BEGINNER,
    description:
      'Design a URL shortening service like TinyURL that converts long URLs into short, unique aliases.',
    expectedComponents: ['API Gateway', 'Database', 'Hash Generator', 'Redirect Service'],
    tags: ['url-shortener', 'hashing', 'redirect'],
  },
  {
    title: 'URL Shortener',
    difficulty: Difficulty.BEGINNER,
    description:
      'Design a scalable URL shortener with custom aliases, analytics, and expiration support.',
    expectedComponents: ['Load Balancer', 'App Servers', 'Database', 'Cache', 'Analytics'],
    tags: ['url-shortener', 'analytics', 'cache'],
  },
  {
    title: 'Parking Lot',
    difficulty: Difficulty.BEGINNER,
    description:
      'Design a parking lot system that supports multiple vehicle types, spot assignment, and payment.',
    expectedComponents: ['Entry Gate', 'Spot Manager', 'Payment Service', 'Display Board'],
    tags: ['oop', 'state-management', 'payments'],
  },
  {
    title: 'Twitter',
    difficulty: Difficulty.INTERMEDIATE,
    description:
      'Design a social media platform like Twitter supporting tweets, timelines, and follow relationships.',
    expectedComponents: ['Timeline Service', 'Fan-out Service', 'User Graph', 'Media Storage'],
    tags: ['social-media', 'timeline', 'fan-out'],
  },
  {
    title: 'Instagram Feed',
    difficulty: Difficulty.INTERMEDIATE,
    description:
      'Design an Instagram-like feed with photo uploads, followers, and personalized content delivery.',
    expectedComponents: ['Feed Generator', 'CDN', 'Object Storage', 'Ranking Service'],
    tags: ['social-media', 'feed', 'cdn'],
  },
  {
    title: 'YouTube',
    difficulty: Difficulty.INTERMEDIATE,
    description:
      'Design a video streaming platform like YouTube with upload, transcoding, and playback at scale.',
    expectedComponents: ['Upload Service', 'Transcoder', 'CDN', 'Recommendation Engine'],
    tags: ['video', 'streaming', 'transcoding'],
  },
  {
    title: 'WhatsApp',
    difficulty: Difficulty.ADVANCED,
    description:
      'Design a messaging platform like WhatsApp supporting real-time chat, groups, and media sharing.',
    expectedComponents: ['WebSocket Gateway', 'Message Queue', 'Presence Service', 'Media Storage'],
    tags: ['messaging', 'real-time', 'websocket'],
  },
  {
    title: 'Uber',
    difficulty: Difficulty.ADVANCED,
    description:
      'Design a ride-sharing platform like Uber with driver matching, routing, and payments.',
    expectedComponents: ['Matching Service', 'Geo Index', 'Trip Service', 'Payment Gateway'],
    tags: ['marketplace', 'geolocation', 'matching'],
  },
  {
    title: 'Netflix',
    difficulty: Difficulty.ADVANCED,
    description:
      'Design a video streaming service like Netflix with content delivery, recommendations, and encoding.',
    expectedComponents: ['Encoding Pipeline', 'CDN', 'Recommendation Engine', 'Content Catalog'],
    tags: ['streaming', 'recommendations', 'cdn'],
  },
  {
    title: 'Global CDN',
    difficulty: Difficulty.STAFF,
    description:
      'Design a global content delivery network that caches and serves static and dynamic content worldwide.',
    expectedComponents: ['Edge Servers', 'Origin Shield', 'DNS Routing', 'Cache Invalidation'],
    tags: ['cdn', 'distributed-systems', 'caching'],
  },
  {
    title: 'Distributed Cache',
    difficulty: Difficulty.STAFF,
    description:
      'Design a distributed in-memory cache system with consistency, eviction policies, and fault tolerance.',
    expectedComponents: ['Consistent Hashing', 'Replication', 'Eviction Policy', 'Cluster Manager'],
    tags: ['caching', 'consistent-hashing', 'distributed-systems'],
  },
  {
    title: 'Event Streaming Platform',
    difficulty: Difficulty.STAFF,
    description:
      'Design an event streaming platform like Kafka supporting high-throughput pub/sub and durable logs.',
    expectedComponents: ['Brokers', 'Partitions', 'Consumer Groups', 'Schema Registry'],
    tags: ['event-streaming', 'kafka', 'pub-sub'],
  },
];

async function main() {
  for (const question of questions) {
    await prisma.question.upsert({
      where: { id: question.title.toLowerCase().replace(/\s+/g, '-') },
      update: question,
      create: {
        id: question.title.toLowerCase().replace(/\s+/g, '-'),
        ...question,
      },
    });
  }

  console.log(`Seeded ${questions.length} questions`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
