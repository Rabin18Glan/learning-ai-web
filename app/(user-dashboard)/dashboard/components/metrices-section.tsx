import { metrices } from '../data/metrices'
import MetricCard from './metric-card'

function MetricesSection() {

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {
                metrices.map((metric, index) => {
                    return <MetricCard key={index} metricData={metric} />
                })
            }
        </div>
    )
}

export default MetricesSection