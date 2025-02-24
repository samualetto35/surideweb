document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('rides-list').innerHTML = '<div class="loading">Veriler yükleniyor...</div>';

    const apiUrl = 'https://sheetdb.io/api/v1/nikwzdap8rqt0';

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                const rides = data.map(item => ({
                    id: item["Sürücü ID"] || '',
                    name: item["İsim Soyisim"] || 'İsim belirtilmemiş',
                    email: item["Email"] || '',
                    phone: item["Telefon"] || '',
                    when: item["Ne Zaman?"] || 'Belirtilmemiş',
                    where: item["Nereye?"] || 'Belirtilmemiş',
                    note: item["Not"] || '',
                    link: extractURL(item["İletişim Bilgisi Gönder"] || '')
                }));
                displayRidesFromArray(rides);
            } else {
                document.getElementById('rides-list').innerHTML =
                    '<div class="no-rides">Henüz hiç ilan bulunmuyor.</div>';
            }
        })
        .catch(error => {
            console.error('Veri çekme hatası:', error);
            document.getElementById('rides-list').innerHTML =
                '<div class="error">Veriler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.</div>';
        });
});

// 📌 SHEET'TEKİ HYPERLINK FORMATINI DÜZELTİYOR
function extractURL(cellValue) {
    if (!cellValue) return ''; // Boşsa direkt boş döndür
    if (cellValue.startsWith("=HYPERLINK(")) {
        let match = cellValue.match(/"([^"]+)"/); // URL'yi ayıklıyoruz
        return match ? match[1] : '';
    }
    return cellValue; // Normal bir URL ise direkt döndür
}

function displayRidesFromArray(rides) {
    const ridesList = document.getElementById('rides-list');
    ridesList.innerHTML = '';

    rides.forEach(ride => {
        const displayName = ride.name === 'gizli' ? 'İsim gizli' : ride.name;

        let displayContact = '';
        if (ride.email !== 'gizli' && ride.email) {
            displayContact += `<p><strong>📧 E-posta:</strong> ${ride.email}</p>`;
        }
        if (ride.phone !== 'gizli' && ride.phone) {
            displayContact += `<p><strong>📞 Telefon:</strong> ${ride.phone}</p>`;
        }
        if (!displayContact) {
            displayContact = '<p><em>İletişim bilgisi belirtilmemiş</em></p>';
        }

        // İletişim linki kontrolü
        const contactButton = ride.link 
            ? `<a href="${ride.link}" class="contact-btn" target="_blank">İletişim Bilgini Gönder</a>`
            : '';

        const cardHTML = `
            <div class="ride-card">
                <div class="ride-info">
                    <h3>${displayName}</h3>
                    <p><strong>📅 Ne zaman:</strong> ${ride.when}</p>
                    <p><strong>📍 Nereye:</strong> ${ride.where}</p>
                    ${ride.note ? `<p><strong>📝 Not:</strong> ${ride.note}</p>` : ''}
                    ${displayContact}
                </div>
                ${contactButton}
            </div>
        `;

        ridesList.innerHTML += cardHTML;
    });

    if (ridesList.innerHTML === '') {
        ridesList.innerHTML = '<div class="no-rides">Henüz hiç ilan bulunmuyor.</div>';
    }
}