import type { FC } from "react"
import { Skeleton, Table, Grid, Card, Group } from "@mantine/core"
import { useFilterStore } from "../store/app.store"

interface LaunchesSkeletonLoaderProps {
  count?: number
}

const LaunchesSkeletonLoader: FC<LaunchesSkeletonLoaderProps> = ({ count = 10 }) => {
  const { viewMode } = useFilterStore()

  if (viewMode === "table") {
    return (
      <Table striped highlightOnHover>
        <thead>
          <tr>
            <th>Mission Patch</th>
            <th>Flight #</th>
            <th>Mission Name</th>
            <th>Launch Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array(count)
            .fill(0)
            .map((_, index) => (
              <tr key={index}>
                <td>
                  <Skeleton height={50} circle />
                </td>
                <td>
                  <Skeleton height={20} width={30} />
                </td>
                <td>
                  <Skeleton height={20} width={150} />
                </td>
                <td>
                  <Skeleton height={20} width={100} />
                </td>
                <td>
                  <Skeleton height={20} width={80} radius="xl" />
                </td>
                <td>
                  <Skeleton height={30} width={100} radius="sm" />
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    )
  }

  return (
    <Grid>
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <Grid.Col key={index} xs={12} sm={6} md={4} lg={3}>
            <Card withBorder radius="md" p="md">
              <Card.Section p="md">
                <Skeleton height={140} mb="md" />
              </Card.Section>
              <Group position="apart" mb="xs">
                <Skeleton height={20} width="70%" />
                <Skeleton height={20} circle />
              </Group>
              <Group mb="md">
                <Skeleton height={20} width={80} radius="xl" />
                <Skeleton height={20} width={80} radius="xl" />
              </Group>
              <Skeleton height={15} width="90%" mb="sm" />
              <Skeleton height={15} width="80%" mb="xl" />
              <Skeleton height={36} radius="md" />
            </Card>
          </Grid.Col>
        ))}
    </Grid>
  )
}

export default LaunchesSkeletonLoader
