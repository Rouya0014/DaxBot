const fetch = require('node-fetch');

module.exports = async (timezone = '') => {
    try {
        const url = `https://support.rockstargames.com/services/status.json?tz=Europe/Paris`
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0'
            },
            timeout: 5000
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let data;
        try {
            data = await response.json();
        } catch (jsonError) {
            throw new Error('Failed to parse JSON response');
        }

        if (!data || !Array.isArray(data.statuses)) {
            throw new Error('Unexpected data structure');
        }

        const getServiceStatus = (serviceTag, platformName) => {
            const service = data.statuses.find(s => s.tag === serviceTag);
            if (!service) return 'Unknown';  // Retourner "Unknown" si le service n'est pas trouvé
            const platform = service.services_platforms.find(p => p.name === platformName);
            return platform ? platform.service_status.status : 'Unknown';  // Retourner "Unknown" si la plateforme n'est pas trouvée
        };

        const getServiceDate = (serviceTag, platformName) => {
            const service = data.statuses.find(s => s.tag === serviceTag);
            if (!service) return 'Unknown';
            const platform = service.services_platforms.find(p => p.name === platformName);
            return platform ? `(<t:${Math.floor(new Date(platform.updated).getTime() / 1000)}:R>)` : 'Unknown';
        };
        if (data.updated) {
            // Extraire la date et l'heure de la chaîne
            const dateString = data.updated;  // "October 25, 2024 at 12:00:00 PM GMT+2"

            // Créer un objet Date à partir de la chaîne
            const datePattern = /(\w+ \d{1,2}, \d{4}) at (\d{1,2}:\d{2}:\d{2} [APM]{2}) GMT([+-]\d)/;
            const matches = datePattern.exec(dateString);

            if (matches) {
                const datePart = matches[1];  // "October 25, 2024"
                const timePart = matches[2];   // "12:00:00 PM"
                const gmtOffset = parseInt(matches[3], 10);  // "+2" ou "-2"

                // Créer une date locale
                const localDate = new Date(`${datePart} ${timePart} UTC${gmtOffset}`);

                // Appliquer le décalage pour obtenir l'heure en UTC+1
                const utcPlusOne = new Date(localDate.getTime() - (3600 * 1000)); // Soustraire 1 heure (3600 secondes)

                // Formatage de la date en français
                formattedDate = new Intl.DateTimeFormat('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                    timeZone: 'UTC', // Assurer que la date est en UTC
                    hour12: false    // Format 24h
                }).format(utcPlusOne);

                formattedDate = `Mis à jour le ${formattedDate} UTC+1`;
            }
        }


        const allStatuses = [
            getServiceStatus('gtao', 'PC'),
            getServiceStatus('gtao', 'PS4'),
            getServiceStatus('gtao', 'Xbox One'),
            getServiceStatus('gtao', 'PS5'),
            getServiceStatus('gtao', 'Xbox Series X/S'),
            getServiceStatus('sc', 'All Features'),
            getServiceStatus('rglauncher', 'Authentication'),
            getServiceStatus('rglauncher', 'Store'),
            getServiceStatus('rglauncher', 'Cloud Services'),
            getServiceStatus('rglauncher', 'Downloads')
        ];

        const allDown = allStatuses.every(status => status === 'DOWN');

        return {
            gtao: {
                pc: getServiceStatus('gtao', 'PC') + " " + getServiceDate('gtao', 'PC'),
                xboxOne: getServiceStatus('gtao', 'Xbox One') + " " + getServiceDate('gtao', 'Xbox One'),
                ps4: getServiceStatus('gtao', 'PS4') + " " + getServiceDate('gtao', 'PS4'),
                ps5: getServiceStatus('gtao', 'PS5') + " " + getServiceDate('gtao', 'PS5'),
                xboxSerie: getServiceStatus('gtao', 'Xbox Series X/S') + " " + getServiceDate('gtao', 'Xbox Series X/S')
            },
            socialClub: {
                all: getServiceStatus('sc', 'All Features') + " " +  getServiceDate('sc', 'All Features'),
            },
            launcher: {
                authentication: getServiceStatus('rglauncher', 'Authentication') + " " + getServiceDate('rglauncher', 'Authentication'),
                store: getServiceStatus('rglauncher', 'Store') + " " + getServiceDate('rglauncher', 'Store'),
                cloud: getServiceStatus('rglauncher', 'Cloud Services') + " " + getServiceDate('rglauncher', 'Cloud Services'),
                downloads: getServiceStatus('rglauncher', 'Downloads') + " " +  getServiceDate('rglauncher', 'Downloads')
            },
            lastUpdate: formattedDate || 'Unknown',  // Assurer que 'lastUpdate' a une valeur par défaut
            maintenanceMessage: allDown ? '<:DndStatusIcon:1101615251868373006> Tous les services sont actuellement en maintenance.' : null

        };

        
    } catch (error) {
        console.error(`Failed to fetch Rockstar status: ${error.message}`);
    }
};