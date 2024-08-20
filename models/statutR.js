const fetch = require('node-fetch');

module.exports = async (timezone = '', language = '') => {
    try {
        const url = `https://support.rockstargames.com/${language ? `${language}/` : ''}services/status.json${timezone ? `?tz=${timezone}` : ''}`;
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0'
            },
            timeout: 5000  // Timeout de 5 secondes
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
                pc: getServiceStatus('gtao', 'PC'),
                xboxOne: getServiceStatus('gtao', 'Xbox One'),
                ps4: getServiceStatus('gtao', 'PS4'),
                ps5: getServiceStatus('gtao', 'PS5'),
                xboxSerie: getServiceStatus('gtao', 'Xbox Series X/S')
            },
            socialClub: {
                all: getServiceStatus('sc', 'All Features')
            },
            launcher: {
                authentication: getServiceStatus('rglauncher', 'Authentication'),
                store: getServiceStatus('rglauncher', 'Store'),
                cloud: getServiceStatus('rglauncher', 'Cloud Services'),
                downloads: getServiceStatus('rglauncher', 'Downloads')
            },
            lastUpdate: data.updated || 'Unknown',  // Assurer que 'lastUpdate' a une valeur par défaut
            maintenanceMessage: allDown ? 'Tous les services sont actuellement en maintenance.' : null
        };
    } catch (error) {
        console.error(`Failed to fetch Rockstar status: ${error.message}`);
        return {
            gtao: {
                pc: 'Error',
                xboxOne: 'Error',
                ps4: 'Error',
                ps5: 'Error',
                xboxSerie: 'Error'
            },
            socialClub: {
                all: 'Error'
            },
            launcher: {
                authentication: 'Error',
                store: 'Error',
                cloud: 'Error',
                downloads: 'Error'
            },
            lastUpdate: 'Unknown',
            maintenanceMessage: 'Erreur lors de la récupération des statuts'
        };
    }
};