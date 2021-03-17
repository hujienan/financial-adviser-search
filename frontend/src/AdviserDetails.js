function AdviserDetails({ hits }) {
  const items = hits.map((hit, index) => {
    const source = hit._source;
    return (
      <li key={index}>
        {source.name} {source.start_date} {source.end_date}
      </li>
    );
  })
  return (
    <div>
      <ul>
        {items}
      </ul>
    </div>
  )
}

export default AdviserDetails;