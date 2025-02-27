import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function MediaTab() {
  return (
    <Tabs>
      <TabsList>
        <TabsTrigger value='movies'>Movies</TabsTrigger>
        <TabsTrigger value='shows'>TV Shows</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}