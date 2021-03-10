function Result({records}) {

    const tableItems = records.map((record) => 
        <tr key={record.number}>
            <td>{record.name}</td>
            <td>{record.number}</td>
            <td>{record.status}</td>
        </tr>
    );

    return (
        <table className="table-auto w-full bg-white my-10">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Number</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {tableItems}
            </tbody>
        </table>
    )
}

export default Result;