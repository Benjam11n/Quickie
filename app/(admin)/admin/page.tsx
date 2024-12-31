'use client';

import { Users, Sprout, MapPin, Star, Database, Activity } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data for preview
const mockData = {
  users: {
    total: 1243,
    active: 856,
    newToday: 12,
  },
  perfumes: {
    total: 156,
    topBrands: ['Quickie Signature', 'YSL', 'Dior'],
    avgRating: 4.2,
  },
  machines: {
    total: 24,
    active: 22,
    totalSamples: 4567,
  },
  reviews: {
    total: 3456,
    avgRating: 4.1,
    todayCount: 23,
  },
};

export default function AdminPage() {
  const stats = [
    {
      title: 'Users',
      icon: Users,
      stats: [
        { label: 'Total Users', value: mockData.users.total },
        { label: 'Active Users', value: mockData.users.active },
        { label: 'New Today', value: mockData.users.newToday },
      ],
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Perfumes',
      icon: Sprout,
      stats: [
        { label: 'Total Perfumes', value: mockData.perfumes.total },
        { label: 'Average Rating', value: mockData.perfumes.avgRating },
        { label: 'Top Brands', value: mockData.perfumes.topBrands.length },
      ],
      gradient: 'from-pink-500 to-rose-500',
    },
    {
      title: 'Vending Machines',
      icon: MapPin,
      stats: [
        { label: 'Total Machines', value: mockData.machines.total },
        { label: 'Active Machines', value: mockData.machines.active },
        { label: 'Total Samples', value: mockData.machines.totalSamples },
      ],
      gradient: 'from-purple-500 to-indigo-500',
    },
    {
      title: 'Reviews',
      icon: Star,
      stats: [
        { label: 'Total Reviews', value: mockData.reviews.total },
        { label: 'Average Rating', value: mockData.reviews.avgRating },
        { label: 'Today', value: mockData.reviews.todayCount },
      ],
      gradient: 'from-amber-500 to-orange-500',
    },
  ];

  return (
    <div className="container py-10">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Database className="size-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Database Overview</h1>
            <p className="text-muted-foreground">MongoDB Integration Preview</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.title}
                className={`hover-lift group relative overflow-hidden p-6`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}
                />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={`size-10 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}
                    >
                      <Icon className="size-5 text-white" />
                    </div>
                    <Activity className="size-4 text-muted-foreground" />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold">{stat.title}</h3>
                    <div className="mt-2 space-y-1">
                      {stat.stats.map((item) => (
                        <div
                          key={item.label}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-muted-foreground">
                            {item.label}
                          </span>
                          <span className="font-medium">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Schema Preview */}
        <Card className="p-6">
          <Tabs defaultValue="user">
            <TabsList>
              <TabsTrigger value="user">User Schema</TabsTrigger>
              <TabsTrigger value="perfume">Perfume Schema</TabsTrigger>
              <TabsTrigger value="machine">Machine Schema</TabsTrigger>
              <TabsTrigger value="review">Review Schema</TabsTrigger>
            </TabsList>

            <TabsContent value="user" className="mt-4">
              <pre className="overflow-auto rounded-lg bg-muted p-4">
                {JSON.stringify(
                  {
                    email: 'user@example.com',
                    profile: {
                      name: 'John Doe',
                      preferences: {
                        favoriteNotes: ['Vanilla', 'Rose'],
                        dislikedNotes: ['Oud'],
                      },
                    },
                    history: {
                      triedPerfumes: [
                        {
                          perfume: 'ObjectId(...)',
                          rating: 4,
                          review: 'Amazing fragrance!',
                        },
                      ],
                      wishlist: ['ObjectId(...)'],
                    },
                  },
                  null,
                  2
                )}
              </pre>
            </TabsContent>

            <TabsContent value="perfume" className="mt-4">
              <pre className="overflow-auto rounded-lg bg-muted p-4">
                {JSON.stringify(
                  {
                    name: 'Midnight Rendezvous',
                    brand: 'Quickie Signature',
                    notes: {
                      top: ['Bergamot', 'Pink Pepper'],
                      middle: ['Rose', 'Jasmine'],
                      base: ['Vanilla', 'Musk'],
                    },
                    characteristics: {
                      sillage: 8,
                      longevity: 7,
                      value: 9,
                    },
                    rating: {
                      average: 4.5,
                      count: 128,
                    },
                  },
                  null,
                  2
                )}
              </pre>
            </TabsContent>

            <TabsContent value="machine" className="mt-4">
              <pre className="overflow-auto rounded-lg bg-muted p-4">
                {JSON.stringify(
                  {
                    location: {
                      type: 'Point',
                      coordinates: [-73.935242, 40.73061],
                      address: '123 Main St',
                      area: 'Manhattan',
                    },
                    inventory: [
                      {
                        perfume: 'ObjectId(...)',
                        stock: 5,
                        lastRefilled: '2024-03-15T10:00:00Z',
                      },
                    ],
                    status: 'active',
                    metrics: {
                      totalSamples: 1234,
                      popularTimes: {
                        '18:00': 45,
                        '19:00': 67,
                      },
                    },
                  },
                  null,
                  2
                )}
              </pre>
            </TabsContent>

            <TabsContent value="review" className="mt-4">
              <pre className="overflow-auto rounded-lg bg-muted p-4">
                {JSON.stringify(
                  {
                    userId: 'ObjectId(...)',
                    perfume: 'ObjectId(...)',
                    vendingMachineId: 'ObjectId(...)',
                    rating: 5,
                    review: 'Perfect for date nights!',
                    tags: ['romantic', 'long-lasting'],
                    likes: 23,
                  },
                  null,
                  2
                )}
              </pre>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
