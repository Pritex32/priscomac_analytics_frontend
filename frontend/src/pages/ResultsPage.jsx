import Plot from 'react-plotly.js'

function downloadBase64(base64, filename, mime) {
  const link = document.createElement('a')
  link.href = `data:${mime};base64,${base64}`
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export default function ResultsPage({ data, onRunAnother }) {
  const { summary, forecast, forecast_meta, reorder, charts } = data

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Priscomac Analytics</h1>
          <span className="text-sm text-gray-500">Results</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Predicted Demand</h3>
            <p className="text-2xl font-bold text-primary">{summary.total_demand.toFixed(2)}</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Recommended Reorder</h3>
            <p className="text-2xl font-bold text-primary">{reorder.recommended_reorder_quantity.toFixed(2)}</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Growth Trend</h3>
            <p className="text-2xl font-bold text-primary">{forecast_meta.growth_percent}%</p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Forecast Chart</h2>
          <div className="border border-gray-200 rounded-lg p-4">
            <Plot
              data={[
                {
                  x: charts.forecast.data[0].x,
                  y: charts.forecast.data[0].y,
                  type: 'scatter',
                  mode: 'lines',
                  name: 'Historical',
                  line: { color: '#D32F2F', width: 2 },
                },
                {
                  x: charts.forecast.data[1].x,
                  y: charts.forecast.data[1].y,
                  type: 'scatter',
                  mode: 'lines',
                  name: 'Forecast',
                  line: { color: '#1976D2', width: 2, dash: 'dash' },
                },
                {
                  x: charts.forecast.data[2].x,
                  y: charts.forecast.data[2].y,
                  type: 'scatter',
                  mode: 'lines',
                  name: 'Upper Bound',
                  line: { width: 0 },
                  showlegend: false,
                },
                {
                  x: charts.forecast.data[3].x,
                  y: charts.forecast.data[3].y,
                  type: 'scatter',
                  mode: 'lines',
                  name: 'Lower Bound',
                  fill: 'tonexty',
                  fillcolor: 'rgba(25, 118, 210, 0.1)',
                  line: { width: 0 },
                  showlegend: false,
                },
              ]}
              layout={{
                title: 'Demand Forecast',
                xaxis: { title: 'Date' },
                yaxis: { title: 'Demand' },
                template: 'plotly_white',
                margin: { l: 40, r: 40, t: 60, b: 40 },
              }}
              style={{ width: '100%', height: '400px' }}
              config={{ responsive: true }}
            />
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Summary Statistics</h2>
          <div className="border border-gray-200 rounded-lg p-4">
            <Plot
              data={[
                {
                  x: charts.summary.data[0].x,
                  y: charts.summary.data[0].y,
                  type: 'bar',
                  marker: { color: '#D32F2F' },
                },
              ]}
              layout={{
                title: 'Summary Statistics',
                template: 'plotly_white',
                margin: { l: 40, r: 40, t: 60, b: 40 },
              }}
              style={{ width: '100%', height: '300px' }}
              config={{ responsive: true }}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => downloadBase64(data.pdf_base64, 'forecast-report.pdf', 'application/pdf')}
            className="flex-1 bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Download PDF
          </button>
          <button
            onClick={() => downloadBase64(data.excel_base64, 'forecast-report.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')}
            className="flex-1 border-2 border-primary text-primary font-semibold py-3 rounded-lg hover:bg-primary hover:text-white transition-colors"
          >
            Download Excel
          </button>
          <button
            onClick={onRunAnother}
            className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Run Another Analysis
          </button>
        </div>
      </main>
    </div>
  )
}
