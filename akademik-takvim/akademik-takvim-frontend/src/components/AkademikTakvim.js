import React, { useEffect, useState } from 'react';
import { get_takvim } from '../api/api';
import './AkademikTakvim.css';
import Navbar from './Navbar';

const AkademikTakvim = () => {
    const [takvim, setTakvim] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const selectedTakvim = localStorage.getItem('selectedTakvim');
            if (!selectedTakvim) {
                console.error('selectedTakvim bulunamadı!');
                return;
            }

            const data = await get_takvim(selectedTakvim);
            setTakvim(data);
            console.log(data.year);
        };

        fetchData();
    }, []);

    const downloadFile = (content, fileName, mimeType) => {
        const blob = new Blob([content], { type: mimeType });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownloadICS = () => {
        if (!takvim || !takvim.events) return;

        let icsContent = 'BEGIN:VCALENDAR\nVERSION:2.0\n';
        takvim.events.forEach(event => {
            const start = event.start_date.replace(/-/g, '') + 'T000000';
            const end = event.end_date.replace(/-/g, '') + 'T235959';
            icsContent += `BEGIN:VEVENT\nSUMMARY:${event.name}\nDTSTART:${start}\nDTEND:${end}\nEND:VEVENT\n`;
        });
        icsContent += 'END:VCALENDAR';
        downloadFile(icsContent, `${takvim.name}.ics`, 'text/calendar');
    };

    const handleDownloadCSV = () => {
        if (!takvim || !takvim.events) return;

        const csvHeaders = 'Akademik Olay,Tarih (Güz),Bitiş (Güz),Tarih (Bahar),Bitiş (Bahar)\n';
        const csvRows = takvim.events.map(event => {
            return `${event.name},${event.term === 'Güz' ? event.start_date : '-'},${event.term === 'Güz' ? event.end_date : '-'},${event.term === 'Bahar' ? event.start_date : '-'},${event.term === 'Bahar' ? event.end_date : '-'}`;
        }).join('\n');

        const csvContent = csvHeaders + csvRows;
        downloadFile(csvContent, `${takvim.name}.csv`, 'text/csv');
    };

    return (
        <div>
            <Navbar />
            <button style={{marginBottom: '4px', marginTop:'4px'}} onClick={handleDownloadICS}>Takvimi ICS Olarak İndir</button>
            <button onClick={handleDownloadCSV}>Takvimi CSV Olarak İndir</button>
            <div id='akademik-takvim'>
                <center>
                    <h1>{takvim ? `KIRKLARELİ ÜNİVERSİTESİ ${takvim.year} ${takvim.name.toUpperCase()}` : "Yükleniyor..."}</h1>
                </center>
                {takvim && takvim.events && takvim.events.length > 0 ? (
                    <center>
                        <table className="akademik-takvim-table" style={{ width: '80%' }}>
                            <thead>
                                <tr>
                                    <th rowSpan="2">AKADEMİK OLAY</th>
                                    <th colSpan="2"><center>GÜZ YARIYILI</center></th>
                                    <th colSpan="2"><center>BAHAR YARIYILI</center></th>
                                </tr>
                                <tr>
                                    <th><center>Tarih</center></th>
                                    <th><center>Bitiş</center></th>
                                    <th><center>Tarih</center></th>
                                    <th><center>Bitiş</center></th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.values(
                                    takvim.events.reduce((acc, event) => {
                                        if (!acc[event.name]) {
                                            acc[event.name] = {
                                                name: event.name,
                                                guzStart: event.term === "Güz" ? event.start_date : "-",
                                                guzEnd: event.term === "Güz" ? event.end_date : "-",
                                                baharStart: event.term === "Bahar" ? event.start_date : "-",
                                                baharEnd: event.term === "Bahar" ? event.end_date : "-",
                                            };
                                        } else {
                                            if (event.term === "Güz") {
                                                acc[event.name].guzStart = event.start_date;
                                                acc[event.name].guzEnd = event.end_date;
                                            } else if (event.term === "Bahar") {
                                                acc[event.name].baharStart = event.start_date;
                                                acc[event.name].baharEnd = event.end_date;
                                            }
                                        }
                                        return acc;
                                    }, {})
                                )
                                    .sort((a, b) => {
                                        const guzStartA = new Date(a.guzStart === "-" ? "9999-12-31" : a.guzStart);
                                        const guzStartB = new Date(b.guzStart === "-" ? "9999-12-31" : b.guzStart);
                                        return guzStartA - guzStartB;
                                    })
                                    .map((event, index) => (
                                        <tr key={index}>
                                            <td>{event.name}</td>
                                            {event.guzStart === event.guzEnd ? (
                                                <td colSpan="2"><center>{event.guzStart}</center></td>
                                            ) : (
                                                <>
                                                    <td><center>{event.guzStart}</center></td>
                                                    <td><center>{event.guzEnd}</center></td>
                                                </>
                                            )}
                                            {event.baharStart === event.baharEnd ? (
                                                <td colSpan="2"><center>{event.baharStart}</center></td>
                                            ) : (
                                                <>
                                                    <td><center>{event.baharStart}</center></td>
                                                    <td><center>{event.baharEnd}</center></td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </center>
                ) : (
                    <p>Yükleniyor veya veri bulunamadı.</p>
                )}
            </div>
        </div>
    );
};

export default AkademikTakvim;
