// Virtual Lab Manager
class LabManager {
    constructor() {
        this.currentExperiment = null;
        this.experimentStep = 0;
        this.labEquipment = {};
        this.chemicals = {};
        this.results = {};
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        
        this.init();
    }

    init() {
        this.setupLabEquipment();
        this.setupChemicals();
    }

    setupLabEquipment() {
        this.labEquipment = {
            'test-tube': {
                name: 'Tabung Reaksi',
                capacity: 10,
                content: null,
                temperature: 25
            },
            'beaker': {
                name: 'Gelas Kimia',
                capacity: 100,
                content: null,
                temperature: 25
            },
            'pipette': {
                name: 'Pipet',
                capacity: 5,
                content: null
            },
            'burner': {
                name: 'Pembakar Bunsen',
                isOn: false,
                temperature: 0
            },
            'ph-meter': {
                name: 'pH Meter',
                reading: 7.0
            },
            'thermometer': {
                name: 'Termometer',
                reading: 25
            }
        };
    }

    setupChemicals() {
        this.chemicals = {
            'hcl': {
                name: 'Asam Klorida (HCl)',
                concentration: 0.1,
                ph: 1.0,
                color: '#ffffff',
                state: 'liquid'
            },
            'naoh': {
                name: 'Natrium Hidroksida (NaOH)',
                concentration: 0.1,
                ph: 13.0,
                color: '#ffffff',
                state: 'liquid'
            },
            'phenolphthalein': {
                name: 'Fenolftalein',
                concentration: 0.01,
                color: '#ffffff',
                state: 'liquid',
                indicator: true
            },
            'litmus': {
                name: 'Kertas Lakmus',
                color: '#purple',
                state: 'solid',
                indicator: true
            },
            'water': {
                name: 'Air Destilasi',
                ph: 7.0,
                color: '#ffffff',
                state: 'liquid'
            }
        };
    }

    startExperiment(experimentType) {
        this.currentExperiment = experimentType;
        this.experimentStep = 0;
        this.results = {};
        
        // Create lab interface
        this.createLabInterface();
        
        // Load experiment-specific setup
        switch(experimentType) {
            case 'acid-base':
                this.setupAcidBaseExperiment();
                break;
            case 'endothermic':
                this.setupEndothermicExperiment();
                break;
            default:
                console.log('Unknown experiment type');
        }
    }

    createLabInterface() {
        // Create modal for lab interface
        const labModal = document.createElement('div');
        labModal.id = 'lab-modal';
        labModal.className = 'lab-modal';
        
        labModal.innerHTML = `
            <div class="lab-interface">
                <div class="lab-header">
                    <h2 id="experiment-title">Laboratorium Virtual</h2>
                    <button class="close-lab-btn" onclick="LabManager.closeLab()">×</button>
                </div>
                
                <div class="lab-content">
                    <div class="lab-workspace">
                        <div class="lab-table">
                            <div id="lab-equipment-area" class="equipment-area">
                                <!-- Equipment will be added here -->
                            </div>
                            <div id="lab-3d-view" class="lab-3d-view">
                                <!-- 3D visualization will be rendered here -->
                            </div>
                        </div>
                    </div>
                    
                    <div class="lab-sidebar">
                        <div class="experiment-steps">
                            <h3>Langkah Eksperimen</h3>
                            <div id="steps-container" class="steps-container">
                                <!-- Steps will be loaded here -->
                            </div>
                        </div>
                        
                        <div class="chemicals-panel">
                            <h3>Bahan Kimia</h3>
                            <div id="chemicals-container" class="chemicals-container">
                                <!-- Chemicals will be loaded here -->
                            </div>
                        </div>
                        
                        <div class="results-panel">
                            <h3>Hasil Pengamatan</h3>
                            <div id="results-container" class="results-container">
                                <!-- Results will be recorded here -->
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="lab-controls">
                    <button id="prev-step-btn" class="lab-btn secondary" disabled>Sebelumnya</button>
                    <button id="next-step-btn" class="lab-btn primary">Selanjutnya</button>
                    <button id="reset-experiment-btn" class="lab-btn danger">Reset</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(labModal);
        
        // Setup event listeners
        this.setupLabEventListeners();
        
        // Initialize 3D scene
        this.init3DScene();
        
        // Show modal
        setTimeout(() => {
            labModal.classList.add('active');
        }, 100);
    }

    setupLabEventListeners() {
        document.getElementById('next-step-btn').addEventListener('click', () => {
            this.nextStep();
        });
        
        document.getElementById('prev-step-btn').addEventListener('click', () => {
            this.previousStep();
        });
        
        document.getElementById('reset-experiment-btn').addEventListener('click', () => {
            this.resetExperiment();
        });
    }

    init3DScene() {
        const container = document.getElementById('lab-3d-view');
        
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf0f0f0);
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        this.camera.position.set(0, 5, 10);
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        container.appendChild(this.renderer.domElement);
        
        // Add lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
        
        // Add lab table
        this.addLabTable();
        
        // Start render loop
        this.animate();
    }

    addLabTable() {
        const tableGeometry = new THREE.BoxGeometry(8, 0.2, 4);
        const tableMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const table = new THREE.Mesh(tableGeometry, tableMaterial);
        table.position.y = -1;
        table.receiveShadow = true;
        this.scene.add(table);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
    }

    setupAcidBaseExperiment() {
        document.getElementById('experiment-title').textContent = 'Identifikasi Asam Basa';
        
        const steps = [
            {
                title: 'Persiapan Alat dan Bahan',
                description: 'Siapkan tabung reaksi, pipet, dan bahan kimia yang diperlukan',
                action: 'setup'
            },
            {
                title: 'Tambahkan Larutan Sampel',
                description: 'Masukkan 5 ml larutan yang akan diuji ke dalam tabung reaksi',
                action: 'add_sample'
            },
            {
                title: 'Tambahkan Indikator',
                description: 'Teteskan 2-3 tetes indikator fenolftalein',
                action: 'add_indicator'
            },
            {
                title: 'Amati Perubahan Warna',
                description: 'Catat perubahan warna yang terjadi',
                action: 'observe'
            },
            {
                title: 'Kesimpulan',
                description: 'Tentukan sifat asam atau basa dari sampel',
                action: 'conclude'
            }
        ];
        
        this.loadExperimentSteps(steps);
        this.loadChemicals(['hcl', 'naoh', 'phenolphthalein', 'water']);
        this.addLabEquipment(['test-tube', 'pipette', 'beaker']);
    }

    setupEndothermicExperiment() {
        document.getElementById('experiment-title').textContent = 'Reaksi Endoterm & Eksoterm';
        
        const steps = [
            {
                title: 'Persiapan',
                description: 'Siapkan gelas kimia dan termometer',
                action: 'setup'
            },
            {
                title: 'Ukur Suhu Awal',
                description: 'Catat suhu awal larutan',
                action: 'measure_initial_temp'
            },
            {
                title: 'Campurkan Reaktan',
                description: 'Tambahkan reaktan dan aduk perlahan',
                action: 'mix_reactants'
            },
            {
                title: 'Monitor Suhu',
                description: 'Amati perubahan suhu selama reaksi',
                action: 'monitor_temp'
            },
            {
                title: 'Analisis Hasil',
                description: 'Tentukan jenis reaksi berdasarkan perubahan suhu',
                action: 'analyze'
            }
        ];
        
        this.loadExperimentSteps(steps);
        this.loadChemicals(['hcl', 'naoh', 'water']);
        this.addLabEquipment(['beaker', 'thermometer', 'pipette']);
    }

    loadExperimentSteps(steps) {
        const container = document.getElementById('steps-container');
        container.innerHTML = '';
        
        steps.forEach((step, index) => {
            const stepElement = document.createElement('div');
            stepElement.className = `experiment-step ${index === 0 ? 'active' : ''}`;
            stepElement.innerHTML = `
                <div class="step-number">${index + 1}</div>
                <div class="step-content">
                    <h4>${step.title}</h4>
                    <p>${step.description}</p>
                </div>
            `;
            container.appendChild(stepElement);
        });
        
        this.experimentSteps = steps;
    }

    loadChemicals(chemicalIds) {
        const container = document.getElementById('chemicals-container');
        container.innerHTML = '';
        
        chemicalIds.forEach(id => {
            const chemical = this.chemicals[id];
            if (chemical) {
                const chemicalElement = document.createElement('div');
                chemicalElement.className = 'chemical-item';
                chemicalElement.draggable = true;
                chemicalElement.dataset.chemicalId = id;
                
                chemicalElement.innerHTML = `
                    <div class="chemical-icon" style="background-color: ${chemical.color}"></div>
                    <span class="chemical-name">${chemical.name}</span>
                `;
                
                // Add drag event listeners
      