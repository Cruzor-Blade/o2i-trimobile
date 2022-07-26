module.exports = {
    en: {
        country: [
            {label:'Cameroon', value:'CMR'},
            {label:'Gabon', value:'GAB'},
            {label:'Central African Republic', value:'CAF'},
            {label:'Democratic Republic of the Congo', value:'COD'},
            {label:'Republic of the Congo', value:'COG'},
        ],
        organisation: {
            CMR:[{label: 'FLAG', value:'FLAG'}, {label: 'FODER', value:'FODER'}, {label: 'SAJLD', value:'SAJLD'}],
            GAB:[{label: 'BRAINFOREST', value:'BRAINFOREST'}],
            CAF:[{label: 'CIEDD', value:'CIEDD'}],
            COD:[{label: 'OGF', value:'OGF'}, {label: 'RNN', value:'RNN'}],
            COG:[{label: 'CAGDF', value:'CAGDF'}, {label: 'CJJ', value:'CJJ'}]
        },
        category: [
            {label:'Strategic Documents', value:'SD'},        
            {label:'Contractual Documents', value:'CD'},        
            {label:'OI Reports', value:'OI-R'},        
            {label:'OI Technical Synthesis', value:'OI-TS'},        
            {label:'Periodical Report', value:'PR'},        
            {label:'OI Manual/Guide', value:'OI-G'},        
            {label:'CR/PV Lecture commitee/ Ad-hoc commitee', value:'CR-PV'},        
            {label:'Press Articles', value:'PA'},
            {label:'Scientific publications on the OI', value:'SP-OI'},                
        ],
        domain:{
            allowed:['SD', 'OI-R', 'OI-TS'],
            values:[
                {label:'Forest', value:'forest'},
                {label:'Fauna', value:'fauna'},
                {label:'Mine', value:'mine'},
                {label:'Fishing', value:'fishing'},
                {label:'Environment', value:'environment'},
            ]
        },
        OIType: {
            allowed:['CD', 'OI-R', 'OI-G', 'CR-PV'],
            values: [
                {label:'Mandated OI', value:'mandated'},
                {label:'External OI', value:'external'},
            ]
        },
        reportType: {    
            allowed:['SD', 'CD', 'OI-R', 'OI-TS', 'PR', 'OI-G', 'PA'],
            values: {
                'SD':[
                    {label:"Action plan", value:'AP'},
                    {label:'Strategy', value:'strategy'},
                    {label:'Chart', value:'chart'}
                ],
                'CD':[
                    {label:"Contract/agreement protocol", value:'C/AP'},
                    {label:"Mandat/OI Reference terms", value:'M/RT'},
                    {label:"CDL creating act", value:'CDL-CA'}
                ],
                'OI-R':[
                    {label:'Conjunct mission', value:'conjunct'},
                    {label:'Independent mission', value:'independent'},
                    {label:'Accompanied mission', value:'accompanied'},
                    {label:'Verification mission', value:'verification'},
                    {label:'Others missions', value:'others'},
                ],
                'OI-TS':[
                    {label:"Analysis note", value:'AN'},
                    {label:"Information note", value:'IN'},
                    {label:"Note de synthese des rapports d'OI", value: 'SRN'}
                ],
                'PR': [
                    {label:'Thematic report', value:'TR'},
                    {label:"Activity and narrative report", value:'ANR'}
                ],
                'OI-G': [
                    {label:"Mandated OI manual", value:'MM'},
                    {label:"External OI manual", value:'EM'}
                ],
                'PA': [
                    {label:'Workshop', value:'workshop'},
                    {label:'Press Conference', value:'PC'},
                    {label:'General information', value:'GI'}
                ]
            }
        },
        placeholders: {
            allowed:['SD', 'CD', 'OI-R', 'OI-TS', 'PR', 'OI-G', 'CR-PV', 'PA', 'SP-OI'],
            title: {
                value:'Title of the document',
            },
            period: {
                value:'Period'
            },
            concernedTitles: {
                allowed:['OI-R',],
                value:'Concerned titles',
            },
            editor: {
                allowed:['SP-OI'],
                value:'Editor',
            },
            journal: {
                allowed:['PA'],
                value:'Journal',
            },
            validityPeriod: {
                allowed:['SD'],
                value:'Validity period (if applicable)',
            },
            publicationDate: {
                allowed:['OI-R', 'OI-TS', 'PR', 'OI-G', 'PA', 'SP-OI'],
                value: 'Publication date',
            },
            document: {
                value: 'Choisir un document',
            },
        },

    },
    fr: {
        country: [
            {label:'Cameroun', value:'CMR'},
            {label:'Gabon', value:'GAB'},
            {label:'République Centrafricaine', value:'CAF'},
            {label:'République Démocratique du Congo', value:'COD'},
            {label:'République du Congo', value:'COG'},
        ],
        organisation: {
            CMR:[{label: 'FLAG', value:'FLAG'}, {label: 'FODER', value:'FODER'}, {label: 'SAJLD', value:'SAJLD'}],
            GAB:[{label: 'BRAINFOREST', value:'BRAINFOREST'}],
            CAF:[{label: 'CIEDD', value:'CIEDD'}],
            COD:[{label: 'OGF', value:'OGF'}, {label: 'RNN', value:'RNN'}],
            COG:[{label: 'CAGDF', value:'CAGDF'}, {label: 'CJJ', value:'CJJ'}]
        },
        category: [
            {label:'Documents stratégiques', value:'SD'},        
            {label:'Documents  contractuels', value:'CD'},        
            {label:"Rapports d'OI", value:'OI-R'},        
            {label:"Synthèses techniques sur l'OI", value:'OI-TS'},        
            {label:'Rapport Périodiques', value:'PR'},        
            {label:"Manuel/Guide d'OI", value:'OI-G'},        
            {label:'CR/PV Comité de lecture/comité ad hoc', value:'CR-PV'},        
            {label:'Articles de presse', value:'PA'},
            {label:'Publication scientifique sur l’OI', value:'SP-OI'},                
        ],
        domain:{
            allowed:['SD', 'OI-R', 'OI-TS'],
            values:[
                {label:'Forêt', value:'forest'},
                {label:'Faune', value:'fauna'},
                {label:'Mine', value:'mine'},
                {label:'Pêche', value:'fishing'},
                {label:'Environnement', value:'environment'},
            ]
        },
        OIType: {
            allowed:['CD', 'OI-R', 'OI-G', 'CR-PV'],
            values:[
                {label:'OI mandatée', value:'mandated'},
                {label:'OI externe', value:'external'},
            ]
        },
        reportType: {    
            allowed:['SD', 'CD', 'OI-R', 'OI-TS', 'PR', 'OI-G', 'PA'],
            values: {
                'SD':[
                    {label:"Plan d'action", value:'AP'},
                    {label:'Stratégie', value:'strategy'},
                    {label:'Charte', value:'chart'}
                ],
                'CD':[
                    {label:"Contrat/protocole d'accord", value:'C/AP'},
                    {label:"Mandat/Termes de réferences de l'OI", value:'M/RT'},
                    {label:"Acte créant les CDL", value:'CDL-CA'}
                ],
                'OI-R':[
                    {label:'Mission conjointe', value:'conjunct'},
                    {label:'Mission Indépendante', value:'accompanied'},
                    {label:'Mission accompagnée', value:'accompanied'},
                    {label:'Mission de vérification', value:'verification'},
                    {label:'Autres missions', value:'others'},
                ],
                'OI-TS':[
                    {label:"Note d'analyse", value:'AN'},
                    {label:"Note d'information", value:'IN'},
                    {label:"Note de synthèse des rapports d'OI", value:'SRN'}
                ],
                'PR': [
                    {label:'Rapport thématique', value:'TR'},
                    {label:"Rapport d'activité et narratif", value:'ANR'}
                ],
                'OI-G': [
                    {label:"Manuel d'OI mandatée", value:'MM'},
                    {label:"Manuel d'OI externe", value:'EM'}
                ],
                'PA': [
                    {label:'Atelier', value:'workshop'},
                    {label:'Conférence de presse', value:'PC'},
                    {label:'Information générale', value:'GI'}
                ]
            }
        },
        placeholders: {
            allowed:['SD', 'CD', 'OI-R', 'OI-TS', 'PR', 'OI-G', 'CR-PV', 'PA', 'SP-OI'],
            title: {
                value:'Titre du document',
            },
            period: {
                value:'Période'
            },
            concernedTitles: {
                allowed:['OI-R',],
                value:'Titres concernés',
            },
            editor: {
                allowed:['SP-OI'],
                value:'Éditeur',
            },
            journal: {
                allowed:['PA'],
                value:'Journal',
            },
            validityPeriod: {
                allowed:['SD'],
                value:'Période de validité (dans le cas échéant)',
            },
            publicationDate: {
                allowed:['OI-R', 'OI-TS', 'PR', 'OI-G', 'PA', 'SP-OI'],
                value: 'Date de publication',
            },
            document: {
                value: 'Choisir un document',
            },
        },

    }
}