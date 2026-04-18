import { useParams } from '@solidjs/router'
import { createRoute } from 'solid-file-router'

import { ProjectView } from './projects.[projectId]'

export default createRoute({
  component: () => {
    const params = useParams<{ projectId: string; checkpointId: string }>()

    return (
      <ProjectView checkpointId={params.checkpointId ?? ''} projectId={params.projectId ?? ''} />
    )
  },
})
