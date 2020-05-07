/*jshint esversion: 6 */
import React from 'react';

function renderLogs(logs) {
    const result = [];
    let counter = 0;
    logs
        .sort(function (log1, log2) {
            return log2.time - log1.time;
        })
        .forEach(rec => {
            result.push(
                <div key={'log-row-' + counter} className="row">
                    <div key={'log-row-col-' + counter} className="col-sm-12 small text-muted">
                        {rec.text}
                    </div>
                </div>
            );
            counter++;
        });
    return result;
}

const LogsRenderer = ({logs}) => {
    return (
        <div>
            {renderLogs(logs)}
        </div>
    )
}

export default LogsRenderer;
