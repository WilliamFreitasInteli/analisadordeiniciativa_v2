export interface InteliModule {
  id: string;
  code: string; // Ex: 'SIMD7', '1AMD2', 'ESMD5'
  controlCode: string; // Ex: 'Módulo 07_SI', 'Módulo 01_IN'
  course: 'Turma de 1° ano' | 'Ciência da Computação' | 'Engenharia de Computação' | 'Engenharia de Software' | 'Sistemas de Informação' | 'ADM Tech';
  moduleNumber: number;
  year: number; // 1, 2, 3 ou 4
  quarter: string; // '1º TRI', '2º TRI', '3º TRI', '4º TRI'
  name: string; // Nome oficial padronizado
  metaprojectName: string; // Nome exato atualizado para o site oficial
  summary: string;
  techStack: string[];
  businessAndLeadership: string[];
  durationWeeks: number;
  deliverables: string[];
  idealPartnerProfile: string;
  complexity: 'Básico' | 'Intermediário' | 'Avançado';
  pdfUrl?: string; // Link direto para o PDF da ementa no site do Inteli
  partnerPortalUrl: string; // Link no portal oficial de projetos do Inteli
}

export const INTELI_MODULES_CATALOG: InteliModule[] = [
  // ==========================================
  // TURMA DE 1º ANO (CICLO BÁSICO COMUM)
  // ==========================================
  {
    id: '1AMD1',
    code: '1AMD1',
    controlCode: 'Módulo 01_IN',
    course: 'Turma de 1° ano',
    moduleNumber: 1,
    year: 1,
    quarter: '1º TRI',
    name: 'Módulo 01_IN - Jogo Digital',
    metaprojectName: 'Jogo Digital',
    summary: 'Desenvolvimento de jogos digitais 2D com foco em mecânicas interativas, lógica de programação e engajamento do usuário.',
    techStack: ['JavaScript / TypeScript', 'Phaser.js / Canvas API', 'Lógica de Programação e Algoritmos', 'Cinemática e Física 2D', 'Git e GitHub'],
    businessAndLeadership: ['Engenharia de Requisitos', 'Business Model Canvas', 'Experiência do Usuário (UX/UI)', 'Design Thinking', 'Storytelling'],
    durationWeeks: 10,
    deliverables: ['GDD (Game Design Document)', 'Protótipo jogável 2D', 'Documentação de requisitos e modelo de negócios', 'Código-fonte no GitHub'],
    idealPartnerProfile: 'Projetos voltados a engajamento, gamificação de processos, treinamento corporativo interativo, campanhas de conscientização ou educação.',
    complexity: 'Básico',
    pdfUrl: 'https://www.inteli.edu.br/wp-content/uploads/2026/08/MODULO-01-Jogo-Digital-1o-Ano.pdf',
    partnerPortalUrl: 'https://web.inteli.edu.br/projetos-parceiros?codigo=1AMD1'
  },
  {
    id: '1AMD2',
    code: '1AMD2',
    controlCode: 'Módulo 02_IN',
    course: 'Turma de 1° ano',
    moduleNumber: 2,
    year: 1,
    quarter: '2º TRI',
    name: 'Módulo 02_IN - Aplicação Web',
    metaprojectName: 'Aplicação Web',
    summary: 'Desenvolvimento de aplicação para ambiente web completa (frontend responsivo + backend em API + banco de dados relacional) resolvendo um gargalo operacional do parceiro.',
    techStack: ['HTML5 / CSS3 / Tailwind CSS', 'JavaScript / TypeScript', 'Node.js / Express', 'PostgreSQL / SQLite', 'RESTful APIs', 'Modelagem Relacional (DER)'],
    businessAndLeadership: ['Análise de Viabilidade Financeira', 'Mapeamento de Jornada do Usuário (UX/UI)', 'User Stories e Critérios de Aceite', 'Scrum / Kanban em Sprints'],
    durationWeeks: 10,
    deliverables: ['Aplicação Web funcional com CRUD completo', 'Banco de Dados modelado e normalizado', 'Backend documentado com endpoints REST', 'Documentação de requisitos'],
    idealPartnerProfile: 'Portais de atendimento interno ou externo, sistemas de controle operacional, plataformas de agendamento e cadastro, autoatendimento.',
    complexity: 'Básico',
    pdfUrl: 'https://www.inteli.edu.br/wp-content/uploads/2026/08/MODULO-02-Aplicacao-para-Ambiente-Web-1o-Ano.pdf',
    partnerPortalUrl: 'https://web.inteli.edu.br/projetos-parceiros?codigo=1AMD2'
  },
  {
    id: '1AMD3',
    code: '1AMD3',
    controlCode: 'Módulo 03_IN',
    course: 'Turma de 1° ano',
    moduleNumber: 3,
    year: 1,
    quarter: '3º TRI',
    name: 'Módulo 03_IN - Lógica para predição com Inteligência Artificial',
    metaprojectName: 'Lógica para predição com Inteligência Artificial',
    summary: 'Construção de modelo preditivo e lógica para predição com inteligência artificial, aplicando análise exploratória, estatística e algoritmos supervisionados de Machine Learning para tomada de decisão.',
    techStack: ['Python', 'Pandas & NumPy', 'Scikit-Learn', 'Matplotlib / Seaborn', 'Jupyter Notebooks', 'Estatística Descritiva e Inferencial', 'Regressão e Classificação'],
    businessAndLeadership: ['Métricas de Negócio (KPIs, ROI)', 'Data Storytelling', 'Interpretação de Modelos para Stakeholders', 'LGPD e Ética em IA'],
    durationWeeks: 10,
    deliverables: ['Pipeline de pré-processamento de dados', 'Modelos preditivos treinados e validados', 'Relatório técnico comparativo', 'Dashboard de visualização de predições'],
    idealPartnerProfile: 'Previsão de demanda, detecção de churn de clientes, previsão de vendas ou inadimplência, diagnóstico estatístico de falhas, scoring.',
    complexity: 'Básico',
    pdfUrl: 'https://www.inteli.edu.br/wp-content/uploads/2026/08/MODULO-03-Logica-para-Predicao-com-Inteligencia-Artificial-1o-Ano.pdf',
    partnerPortalUrl: 'https://web.inteli.edu.br/projetos-parceiros?codigo=1AMD3'
  },
  {
    id: '1AMD4',
    code: '1AMD4',
    controlCode: 'Módulo 04_IN',
    course: 'Turma de 1° ano',
    moduleNumber: 4,
    year: 1,
    quarter: '4º TRI',
    name: 'Módulo 04_IN - Solução para IoT',
    metaprojectName: 'Solução para IoT',
    summary: 'Desenvolvimento de uma solução para IoT conectada ponta a ponta: sensores físicos, microcontroladores, telemetria em tempo real e dashboard de monitoramento em nuvem.',
    techStack: ['C/C++ (Arduino / ESP32 / FreeRTOS)', 'Sensores e Atuadores', 'Protocolos MQTT / HTTP / WebSockets', 'Python / Node.js Backend', 'Dashboards IoT', 'Brokers MQTT'],
    businessAndLeadership: ['Análise de Custos de Hardware (BOM)', 'Escalabilidade e Manutenção em Campo', 'Segurança em Dispositivos Conectados', 'Lean Startup e Prototipagem Rápida'],
    durationWeeks: 10,
    deliverables: ['Protótipo físico montado e funcional', 'Firmware testado', 'Serviço de coleta e armazenamento em nuvem', 'Dashboard web de telemetria'],
    idealPartnerProfile: 'Monitoramento ambiental ou industrial em tempo real, telemetria de frotas e estoques, automação predial, controle de temperatura ou vibração.',
    complexity: 'Básico',
    pdfUrl: 'https://www.inteli.edu.br/wp-content/uploads/2026/08/MODULO-04-Solucao-para-IoT-1o-Ano.pdf',
    partnerPortalUrl: 'https://web.inteli.edu.br/projetos-parceiros?codigo=1AMD4'
  },

  // ==========================================
  // CIÊNCIA DA COMPUTAÇÃO (CC)
  // ==========================================
  {
    id: 'CCMD5',
    code: 'CCMD5',
    controlCode: 'Módulo 05_CC',
    course: 'Ciência da Computação',
    moduleNumber: 5,
    year: 2,
    quarter: '1º TRI',
    name: 'Módulo 05_CC - Solução de alto desempenho usando grafos',
    metaprojectName: 'Solução de alto desempenho usando grafos',
    summary: 'Desenvolvimento de algoritmos e solução de alto desempenho fundamentada em teoria dos grafos, otimização de caminhos e análise de redes complexas.',
    techStack: ['C++ / Python / Rust', 'Teoria dos Grafos', 'Neo4j / NetworkX', 'Algoritmos Dijkstra / A* / PageRank / Bellman-Ford', 'Estruturas de Dados Avançadas'],
    businessAndLeadership: ['Análise de Eficiência Logística', 'Redução de Custos de Malha', 'Otimização de Redes e Rotas', 'Comunicação Técnica'],
    durationWeeks: 10,
    deliverables: ['Algoritmo de processamento em grafos otimizado', 'Benchmark de complexidade de tempo e memória', 'API para integração', 'Interface de visualização de grafos'],
    idealPartnerProfile: 'Roteamento logístico complexo, detecção de fraudes em transações interconectadas, análise de redes sociais ou telecomunicações, malhas de distribuição.',
    complexity: 'Intermediário',
    pdfUrl: 'https://www.inteli.edu.br/wp-content/uploads/2026/07/Modulo-5-Solucao-de-alto-desempenho-usando-grafos-CC.pdf',
    partnerPortalUrl: 'https://web.inteli.edu.br/projetos-parceiros?codigo=CCMD5'
  },
  {
    id: 'CCMD6',
    code: 'CCMD6',
    controlCode: 'Módulo 06_CC',
    course: 'Ciência da Computação',
    moduleNumber: 6,
    year: 2,
    quarter: '2º TRI',
    name: 'Módulo 06_CC - Otimização combinatória e pesquisa operacional',
    metaprojectName: 'Otimização combinatória e pesquisa operacional',
    summary: 'Resolução de problemas de alta complexidade NP-Hard utilizando programação linear inteira, pesquisa operacional, algoritmos genéticos e meta-heurísticas.',
    techStack: ['Python', 'Solvers de Otimização (OR-Tools, Gurobi, PuLP)', 'Programação Linear e Inteira Mista (MIP)', 'Algoritmos Genéticos e Simulação'],
    businessAndLeadership: ['Pesquisa Operacional Aplicada a Negócios', 'Modelagem de Gargalos de Produção', 'Alocação Ótima de Capital e Escala'],
    durationWeeks: 10,
    deliverables: ['Modelo matemático formulado e documentado', 'Algoritmo heurístico/exato funcional', 'Comparativo de desempenho com cenário base', 'Simulador executivo'],
    idealPartnerProfile: 'Escalonamento complexo de turnos/equipes, empacotamento de cargas (Bin Packing), alocação de frotas e salas cirúrgicas, planejamento de corte e estocagem.',
    complexity: 'Intermediário',
    pdfUrl: 'https://www.inteli.edu.br/wp-content/uploads/2026/07/Modulo-6-Otimizacao-combinatoria-e-pesquisa-operacional-CC.pdf',
    partnerPortalUrl: 'https://web.inteli.edu.br/projetos-parceiros?codigo=CCMD6'
  },
  {
    id: 'CCMD7',
    code: 'CCMD7',
    controlCode: 'Módulo 07_CC',
    course: 'Ciência da Computação',
    moduleNumber: 7,
    year: 2,
    quarter: '3º TRI',
    name: 'Módulo 07_CC - Aplicação escalável em sistemas distribuídos',
    metaprojectName: 'Aplicação escalável em sistemas distribuídos',
    summary: 'Concepção e implementação de arquitetura de alta vazão e concorrência baseada em sistemas distribuídos, mensageria e consistência eventual.',
    techStack: ['Go / Java / Rust', 'Apache Kafka / RabbitMQ', 'Docker / Kubernetes', 'gRPC / Protocol Buffers', 'Bancos NoSQL distribuídos (Cassandra/Redis)', 'Teorema CAP'],
    businessAndLeadership: ['Engenharia de Confiabilidade (SRE)', 'Análise de TCO em Nuvem', 'Design de Arquitetura de Missão Crítica', 'SLAs e SLOs'],
    durationWeeks: 10,
    deliverables: ['Cluster de microsserviços distribuídos implementado', 'Pipeline de mensageria assíncrona', 'Testes de estresse e tolerância a partições'],
    idealPartnerProfile: 'Sistemas de alta volumetria financeira, telemetria em larga escala, pipelines de processamento contínuo de eventos ou jogos online.',
    complexity: 'Intermediário',
    pdfUrl: 'https://www.inteli.edu.br/wp-content/uploads/2026/07/Modulo-7-Aplicacao-escalavel-em-sistemas-distribuidos-CC.pdf',
    partnerPortalUrl: 'https://web.inteli.edu.br/projetos-parceiros?codigo=CCMD7'
  },
  {
    id: 'CCMD8',
    code: 'CCMD8',
    controlCode: 'Módulo 08_CC',
    course: 'Ciência da Computação',
    moduleNumber: 8,
    year: 2,
    quarter: '4º TRI',
    name: 'Módulo 08_CC - IDE para acessibilidade em dispositivos sensoriais',
    metaprojectName: 'IDE para acessibilidade em dispositivos sensoriais',
    summary: 'Desenvolvimento de ferramentas de desenvolvimento (IDE) e interfaces especializadas para acessibilidade, integradas com dispositivos hápticos e sensoriais.',
    techStack: ['Electron / WebAssembly / C++', 'Protocolos de Comunicação Serial e Bluetooth', 'APIs de Acessibilidade (Screen Readers, Haptics)', 'Compiladores e Interpretadores Básicos'],
    businessAndLeadership: ['Inclusão e Acessibilidade (eMAG, WCAG)', 'Design Centrado no Humano', 'Impacto Social e ESG', 'Testes com Usuários Reais'],
    durationWeeks: 10,
    deliverables: ['Ambiente/IDE integrado funcional', 'Driver de comunicação com dispositivo sensorial', 'Módulos de acessibilidade documentados', 'Guia de usabilidade'],
    idealPartnerProfile: 'Soluções de tecnologia assistiva, ferramentas para desenvolvedores com deficiência, interfaces homem-máquina inclusivas.',
    complexity: 'Intermediário',
    pdfUrl: 'https://www.inteli.edu.br/wp-content/uploads/2026/07/Modulo-8-IDE-para-acessibilidade-em-dispositivos-sensoriais-CC.pdf',
    partnerPortalUrl: 'https://web.inteli.edu.br/projetos-parceiros?codigo=CCMD8'
  },
  {
    id: 'CCMD9',
    code: 'CCMD9',
    controlCode: 'Módulo 09_CC',
    course: 'Ciência da Computação',
    moduleNumber: 9,
    year: 3,
    quarter: '1º TRI',
    name: 'Módulo 09_CC - Sistema de deep learning aplicado à visão computacional',
    metaprojectName: 'Sistema de deep learning aplicado à visão computacional',
    summary: 'Criação de pipelines de Deep Learning com Redes Neurais Convolucionais (CNNs) e Vision Transformers para detecção de objetos, segmentação e controle de qualidade visual.',
    techStack: ['Python', 'PyTorch / TensorFlow', 'OpenCV', 'YOLO / Mask R-CNN / Transformers Visuais', 'Data Augmentation', 'MLOps com MLflow'],
    businessAndLeadership: ['Inspeção de Qualidade Automatizada', 'Cálculo de Redução de Desperdício', 'Governança de Dados de Imagem', 'Deploy em Ambientes Industriais'],
    durationWeeks: 10,
    deliverables: ['Modelo treinado com métricas (mAP, F1-Score)', 'Pipeline de inferência de vídeo em tempo real', 'Dashboard de visualização de detecções e alertas'],
    idealPartnerProfile: 'Inspeção de defeitos em linhas de produção, reconhecimento de EPIs e segurança do trabalho, análise de exames por imagem, monitoramento por câmeras.',
    complexity: 'Avançado',
    pdfUrl: 'https://www.inteli.edu.br/wp-content/uploads/2026/07/Modulo-9-Sistema-de-deep-learning-aplicado-a-visao-computacional-CC.pdf',
    partnerPortalUrl: 'https://web.inteli.edu.br/projetos-parceiros?codigo=CCMD9'
  },
  {
    id: 'CCMD10',
    code: 'CCMD10',
    controlCode: 'Módulo 10_CC',
    course: 'Ciência da Computação',
    moduleNumber: 10,
    year: 3,
    quarter: '2º TRI',
    name: 'Módulo 10_CC - Aplicação de redes neurais em aprendizado por reforço',
    metaprojectName: 'Aplicação de redes neurais em aprendizado por reforço',
    summary: 'Modelagem de ambientes complexos para agentes autônomos que aprendem políticas ótimas via Aprendizado por Reforço Profundo (Deep Q-Learning, PPO, Actor-Critic).',
    techStack: ['Python', 'PyTorch', 'OpenAI Gym / Gymnasium', 'Stable-Baselines3', 'Simuladores de Física e Ambientes Markovianos'],
    businessAndLeadership: ['Tomada de Decisão em Ambientes de Alta Incerteza', 'Precificação Dinâmica', 'Otimização de Portfólios e Controle Autônomo'],
    durationWeeks: 10,
    deliverables: ['Ambiente de simulação customizado', 'Agente treinado com convergência de recompensa comprovada', 'Relatório de políticas ótimas aprendidas'],
    idealPartnerProfile: 'Trading algorítmico adaptativo, controle de robôs e drones, gestão dinâmica de inventário, balanceamento de cargas em redes energéticas.',
    complexity: 'Avançado',
    pdfUrl: 'https://www.inteli.edu.br/wp-content/uploads/2026/07/Modulo-10-Aplicacao-de-redes-neurais-artificiais-em-aprendizado-por-reforco-CC.pdf',
    partnerPortalUrl: 'https://web.inteli.edu.br/projetos-parceiros?codigo=CCMD10'
  },
  {
    id: 'CCMD11',
    code: 'CCMD11',
    controlCode: 'Módulo 11_CC',
    course: 'Ciência da Computação',
    moduleNumber: 11,
    year: 3,
    quarter: '3º TRI',
    name: 'Módulo 11_CC - Sistema de processamento de linguagem natural com IA generativa',
    metaprojectName: 'Sistema de processamento de linguagem natural com IA generativa',
    summary: 'Construção de sistemas avançados de PLN, LLMs, arquiteturas RAG (Retrieval-Augmented Generation) com bancos vetoriais e agentes autônomos inteligentes.',
    techStack: ['Python', 'LangChain / LlamaIndex', 'Hugging Face Transformers', 'Vector Databases (Pinecone, Chroma, Qdrant)', 'Embeddings e Fine-Tuning'],
    businessAndLeadership: ['Estratégia de Inteligência Artificial Generativa', 'Segurança, Prompt Injection e Alucinação', 'Compliance e Curadoria de Conteúdo'],
    durationWeeks: 10,
    deliverables: ['Sistema RAG completo com ingestão de documentos', 'Banco vetorial indexado', 'Agente conversacional com validação semântica', 'API e interface de chat'],
    idealPartnerProfile: 'Assistentes jurídicos/médicos em bases normativas extensas, copilotos de atendimento ao cliente com IA, análise de contratos, síntese documental corporativa.',
    complexity: 'Avançado',
    pdfUrl: 'https://www.inteli.edu.br/wp-content/uploads/2026/07/Modulo-11-Sistema-de-processamento-de-linguagem-natural-com-IA-generativa-CC.pdf',
    partnerPortalUrl: 'https://web.inteli.edu.br/projetos-parceiros?codigo=CCMD11'
  },

  // ==========================================
  // ENGENHARIA DA COMPUTAÇÃO (EC)
  // ==========================================
  {
    id: 'ECMD5',
    code: 'ECMD5',
    controlCode: 'Módulo 05_EC',
    course: 'Engenharia de Computação',
    moduleNumber: 5,
    year: 2,
    quarter: '1º TRI',
    name: 'Módulo 05_EC - Automação de processos e sistemas',
    metaprojectName: 'Automação de processos e sistemas',
    summary: 'Desenvolvimento de sistemas de controle e automação industrial/predial com CLPs virtuais, microcontroladores e supervisórios SCADA.',
    techStack: ['C/C++', 'Protocolos Industriais (Modbus, CAN bus)', 'Supervisórios SCADA / Node-RED', 'Instrumentação Industrial', 'Controle PID'],
    businessAndLeadership: ['Indústria 4.0 e OEE (Overall Equipment Effectiveness)', 'Segurança Operacional de Máquinas (NR-12)', 'Gestão de Chão de Fábrica'],
    durationWeeks: 10,
    deliverables: ['Controlador implementado com malha fechada', 'Dashboard supervisório de controle', 'Documentação de engenharia de automação'],
    idealPartnerProfile: 'Automação de células de montagem, controle de processos térmicos/químicos, linhas de envase, automação predial sustentável.',
    complexity: 'Intermediário',
    pdfUrl: 'https://www.inteli.edu.br/wp-content/uploads/2026/07/Modulo-5-Automacao-de-processos-e-sistemas-EC.pdf',
    partnerPortalUrl: 'https://web.inteli.edu.br/projetos-parceiros?codigo=ECMD5'
  },
  {
    id: 'ECMD6',
    code: 'ECMD6',
    controlCode: 'Módulo 06_EC',
    course: 'Engenharia de Computação',
    moduleNumber: 6,
    year: 2,
    quarter: '2º TRI',
    name: 'Módulo 06_EC - Robótica móvel e visão computacional',
    metaprojectName: 'Robótica móvel e visão computacional',
    summary: 'Construção de robôs móveis autônomos (AMRs) com navegação SLAM, sensores LiDAR e visão computacional para navegação em ambientes dinâmicos.',
    techStack: ['ROS 2 (Robot Operating System)', 'Python / C++', 'LiDAR & Sensores Ultrassônicos', 'Odometria e Cinemática Robótica', 'SLAM e Nav2'],
    businessAndLeadership: ['Logística Interna e Armazenagem (Intralogística)', 'Segurança em Robótica Colaborativa', 'Retorno de Investimento em Robótica'],
    durationWeeks: 10,
    deliverables: ['Robô móvel navegando de forma autônoma', 'Mapeamento 2D/3D em tempo real do ambiente', 'Pacotes ROS 2 testados e documentados'],
    idealPartnerProfile: 'Transporte autônomo de materiais em centros de distribuição, robôs de patrulhamento e ronda, inspeção física autônoma de armazéns.',
    complexity: 'Intermediário',
    pdfUrl: 'https://www.inteli.edu.br/wp-content/uploads/2026/07/Modulo-6-Robotica-movel-e-visao-computacional-EC.pdf',
    partnerPortalUrl: 'https://web.inteli.edu.br/projetos-parceiros?codigo=ECMD6'
  },
  {
    id: 'ECMD7',
    code: 'ECMD7',
    controlCode: 'Módulo 07_EC',
    course: 'Engenharia de Computação',
    moduleNumber: 7,
    year: 2,
    quarter: '3º TRI',
    name: 'Módulo 07_EC - Sistema de manutenção preditiva com IA e arquitetura em nuvem',
    metaprojectName: 'Sistema de manutenção preditiva com IA e arquitetura em nuvem',
    summary: 'Sistema completo de monitoramento de saúde de ativos industriais (motores, bombas, compressores) com sensores de vibração/temperatura e modelos de Machine Learning preditivos em nuvem.',
    techStack: ['IoT Industrial (Sensores de Aceleração e Corrente)', 'Python', 'Processamento de Sinais e FFT', 'Machine Learning para Anomalias', 'AWS / Azure IoT Hub'],
    businessAndLeadership: ['Redução de Downtime e MTBF/MTTR', 'Gestão de Ativos Físicos', 'Modelos de Negócios de Monitoramento Contínuo'],
    durationWeeks: 10,
    deliverables: ['Dispositivo de coleta e processamento de sinal', 'Modelo preditivo de degradação treinado', 'Painel web com alertas preditivos de manutenção'],
    idealPartnerProfile: 'Fábricas com maquinário crítico, frotas de transporte rodoviário/ferroviário, geração e distribuição de energia, elevadores e climatização.',
    complexity: 'Intermediário',
    pdfUrl: 'https://www.inteli.edu.br/wp-content/uploads/2026/07/Modulo-7-Sistema-de-manutencao-preditiva-com-IA-e-arquitetura-em-nuvem-EC.pdf',
    partnerPortalUrl: 'https://web.inteli.edu.br/projetos-parceiros?codigo=ECMD7'
  },
  {
    id: 'ECMD8',
    code: 'ECMD8',
    controlCode: 'Módulo 08_EC',
    course: 'Engenharia de Computação',
    moduleNumber: 8,
    year: 2,
    quarter: '4º TRI',
    name: 'Módulo 08_EC - Robô de serviço autônomo com IA generativa',
    metaprojectName: 'Robô de serviço autônomo com IA generativa',
    summary: 'Integração de robótica de serviço física com Inteligência Artificial Generativa para interação multimodal por voz, visão e assistência a humanos em tarefas reais.',
    techStack: ['ROS 2', 'LLMs e Agentes Corporificados (Embodied AI)', 'Processamento de Áudio e Voz (STT/TTS)', 'Câmeras RGB-D', 'Hardware Edge AI (Jetson)'],
    businessAndLeadership: ['Experiência do Cliente em Ambientes de Varejo e Saúde', 'Ergonomia e Aceitação Social da Robótica', 'Novos Modelos de Atendimento'],
    durationWeeks: 10,
    deliverables: ['Robô de serviço capaz de receber comandos em linguagem natural', 'Execução de navegação e tarefas orientadas por voz', 'Código embarcado documentado'],
    idealPartnerProfile: 'Recepção e concierges em hospitais e shoppings, guias autônomos em feiras e museus, atendimento e reposição no varejo.',
    complexity: 'Avançado',
    pdfUrl: 'https://www.inteli.edu.br/wp-content/uploads/2026/07/Modulo-8-Robo-de-servico-autonomo-com-IA-generativa-EC.pdf',
    partnerPortalUrl: 'https://web.inteli.edu.br/projetos-parceiros?codigo=ECMD8'
  },
  {
    id: 'ECMD9',
    code: 'ECMD9',
    controlCode: 'Módulo 09_EC',
    course: 'Engenharia de Computação',
    moduleNumber: 9,
    year: 3,
    quarter: '1º TRI',
    name: 'Módulo 09_EC - Hiperconectividade para Cidades Inteligentes',
    metaprojectName: 'Hiperconectividade para Cidades Inteligentes',
    summary: 'Planejamento e implantação de redes de telecomunicações de baixa potência e longo alcance (LoRaWAN, NB-IoT, 5G privado) para telemetria urbana e sustentabilidade.',
    techStack: ['LoRaWAN / NB-IoT / 5G', 'Gateways de Telecomunicações', 'Georreferenciamento e GIS', 'Gerenciamento de Redes e Espectro', 'Dashboards Urbanos'],
    businessAndLeadership: ['Planejamento de Cidades Inteligentes (Smart Cities)', 'Políticas Públicas e Sustentabilidade Urbana', 'TCO de Redes Metropolitanas'],
    durationWeeks: 10,
    deliverables: ['Estudo de cobertura e propagação de sinal', 'Rede de sensores de campo conectada ao gateway', 'Plataforma de visualização espacial urbana'],
    idealPartnerProfile: 'Prefeituras e concessões de iluminação pública, saneamento básico e medição de água, monitoramento de enchentes e tráfego viário.',
    complexity: 'Avançado',
    pdfUrl: 'https://www.inteli.edu.br/wp-content/uploads/2026/07/Modulo-9-Hiperconectividade-para-Cidades-Inteligentes-EC.pdf',
    partnerPortalUrl: 'https://web.inteli.edu.br/projetos-parceiros?codigo=ECMD9'
  },
  {
    id: 'ECMD10',
    code: 'ECMD10',
    controlCode: 'Módulo 10_EC',
    course: 'Engenharia de Computação',
    moduleNumber: 10,
    year: 3,
    quarter: '2º TRI',
    name: 'Módulo 10_EC - Aplicações Hiperescaláveis',
    metaprojectName: 'Aplicações Hiperescaláveis',
    summary: 'Engenharia de infraestrutura de computação hiperescalável, aceleradores de hardware (FPGAs, GPUs) e otimização de sistemas para tráfego ultra-intenso.',
    techStack: ['C / C++', 'Aceleração em GPU (CUDA) / FPGA', 'Otimização de Kernel Linux', 'Sistemas de Baixa Latência', 'Clusters de Alta Performance'],
    businessAndLeadership: ['Computação de Alta Eficiência Energética (Green Computing)', 'Gestão de Datacenters', 'Modelos Econômicos de Hiperescala'],
    durationWeeks: 10,
    deliverables: ['Solução computacional de altíssimo throughput', 'Benchmark comparativo de latência em milissegundos', 'Relatório de eficiência energética'],
    idealPartnerProfile: 'Provedores de infraestrutura cloud, processamento massivo de vídeo/áudio, finanças de alta frequência (HFT), simulações científicas.',
    complexity: 'Avançado',
    pdfUrl: 'https://www.inteli.edu.br/wp-content/uploads/2026/07/Modulo-10-Aplicacoes-hiperescalaveis-EC.pdf',
    partnerPortalUrl: 'https://web.inteli.edu.br/projetos-parceiros?codigo=ECMD10'
  },
  {
    id: 'ECMD11',
    code: 'ECMD11',
    controlCode: 'Módulo 11_EC',
    course: 'Engenharia de Computação',
    moduleNumber: 11,
    year: 3,
    quarter: '3º TRI',
    name: 'Módulo 11_EC - Sistema em edge computing',
    metaprojectName: 'Sistema em edge computing',
    summary: 'Concepção de nós de computação em borda (Edge Computing) para inferência local de IA sem dependência de nuvem contínua e com tolerância a desconexão.',
    techStack: ['Embedded Linux / Yocto', 'Edge AI (TensorRT, OpenVINO, ONNX)', 'Sincronização Nuvem-Borda', 'TinyML', 'Segurança em Hardware'],
    businessAndLeadership: ['Resiliência Operacional em Locais Remotos', 'Privacidade de Dados Locais', 'Estratégia de Borda vs Nuvem'],
    durationWeeks: 10,
    deliverables: ['Dispositivo de borda com IA embarcada funcional', 'Pipeline de atualização segura (OTA)', 'Métricas de consumo de energia e latência'],
    idealPartnerProfile: 'Agronegócio (máquinas agrícolas autônomas), plataformas marítimas de petróleo, veículos conectados, mineração subterrânea.',
    complexity: 'Avançado',
    pdfUrl: 'https://www.inteli.edu.br/wp-content/uploads/2026/07/Modulo-11-Sistema-em-edge-computing-EC.pdf',
    partnerPortalUrl: 'https://web.inteli.edu.br/projetos-parceiros?codigo=ECMD11'
  },

  // ==========================================
  // ENGENHARIA DE SOFTWARE (ES)
  // ==========================================
  {
    id: 'ESMD5',
    code: 'ESMD5',
    controlCode: 'Módulo 05_ES',
    course: 'Engenharia de Software',
    moduleNumber: 5,
    year: 2,
    quarter: '1º TRI',
    name: 'Módulo 05_ES - Sistema digital de processamento distribuído',
    metaprojectName: 'Sistema digital de processamento distribuído',
    summary: 'Desenvolvimento de serviços escaláveis e arquitetura de processamento em nuvem para ingestão e transformação contínua de grandes fluxos de requisições.',
    techStack: ['Node.js / Go / Java', 'AWS / Google Cloud / Azure', 'Docker e Microsserviços', 'Filas e Mensageria (SQS, RabbitMQ)', 'Bancos SQL e NoSQL'],
    businessAndLeadership: ['FinOps e Controle de Custos em Cloud', 'Design de Arquitetura Limpa (Clean Architecture)', 'Escalabilidade de Produtos Digitais'],
    durationWeeks: 10,
    deliverables: ['Arquitetura de microsserviços implantada', 'Testes de carga e escalabilidade automática', 'Pipeline de CI/CD básico', 'Documentação OpenAPI'],
    idealPartnerProfile: 'Sistemas corporativos com pico sazonal de acesso, integração de múltiplos sistemas legados, gateways de pagamento, plataformas de streaming.',
    complexity: 'Intermediário',
    pdfUrl: 'https://www.inteli.edu.br/wp-content/uploads/2026/07/Modulo-5-Sistema-digital-de-processamento-distribuido-ES.pdf',
    partnerPortalUrl: 'https://web.inteli.edu.br/projetos-parceiros?codigo=ESMD5'
  },
  {
    id: 'ESMD6',
    code: 'ESMD6',
    controlCode: 'Módulo 06_ES',
    course: 'Engenharia de Software',
    moduleNumber: 6,
    year: 2,
    quarter: '2º TRI',
    name: 'Módulo 06_ES - Plataforma digital baseada em arquitetura orientada a serviços',
    metaprojectName: 'Plataforma digital baseada em arquitetura orientada a serviços',
    summary: 'Construção de ecossistema digital orientado a serviços (SOA/Microsserviços) integrando aplicativos móveis multiplataforma com backend robusto.',
    techStack: ['React Native / Flutter', 'APIs RESTful e GraphQL', 'Node.js / Kotlin / Swift', 'Autenticação OAuth2 / OpenID Connect', 'Design System'],
    businessAndLeadership: ['Engajamento e Retenção em Mobile (Product Management)', 'Monetização de Apps', 'Acessibilidade Mobile'],
    durationWeeks: 10,
    deliverables: ['Aplicativo mobile funcional e responsivo', 'Serviços de backend integrados com autenticação', 'Design System documentado', 'Testes automatizados'],
    idealPartnerProfile: 'Aplicativos corporativos para equipes de campo, bancos digitais e carteiras, serviços móveis ao consumidor final, logística de entregas.',
    complexity: 'Intermediário',
    pdfUrl: 'https://www.inteli.edu.br/wp-content/uploads/2026/07/Modulo-6-Plataforma-digital-baseada-em-arquitetura-orientada-a-servicos-ES.pdf',
    partnerPortalUrl: 'https://web.inteli.edu.br/projetos-parceiros?codigo=ESMD6'
  },
  {
    id: 'ESMD7',
    code: 'ESMD7',
    controlCode: 'Módulo 07_ES',
    course: 'Engenharia de Software',
    moduleNumber: 7,
    year: 2,
    quarter: '3º TRI',
    name: 'Módulo 07_ES - Processamento de linguagens naturais em texto, vídeo e áudio',
    metaprojectName: 'Processamento de linguagens naturais em texto, vídeo e áudio',
    summary: 'Desenvolvimento de sistemas de automação multimodal com PLN, reconhecimento de voz, análise de sentimento e transcrição/indexação de áudio e vídeo.',
    techStack: ['Python', 'Speech-to-Text (Whisper) & Text-to-Speech', 'NLP (Spacy, Transformers)', 'Processamento de Mídia (FFmpeg)', 'APIs de IA Cognitiva'],
    businessAndLeadership: ['Automação de Contatos e Atendimento', 'Análise de Sentimento da Marca', 'Eficiência Operacional em Suporte'],
    durationWeeks: 10,
    deliverables: ['Pipeline de processamento multimodal funcional', 'Classificador semântico e sumarizador', 'Interface de operação com métricas'],
    idealPartnerProfile: 'Centrais de atendimento ao cliente (SAC), análise de gravações de reuniões e audiências, automação de comandos por voz em sistemas.',
    complexity: 'Intermediário',
    pdfUrl: 'https://www.inteli.edu.br/wp-content/uploads/2026/07/Modulo-7-Processamento-de-linguagens-naturais-em-texto-video-e-audio-ES.pdf',
    partnerPortalUrl: 'https://web.inteli.edu.br/projetos-parceiros?codigo=ESMD7'
  },
  {
    id: 'ESMD8',
    code: 'ESMD8',
    controlCode: 'Módulo 08_ES',
    course: 'Engenharia de Software',
    moduleNumber: 8,
    year: 2,
    quarter: '4º TRI',
    name: 'Módulo 08_ES - Arquitetura digital segura e tolerante a falhas',
    metaprojectName: 'Arquitetura digital segura e tolerante a falhas',
    summary: 'Engenharia de software com foco em cibersegurança, criptografia, tolerância a falhas, conformidade LGPD e testes de intrusão/resiliência.',
    techStack: ['DevSecOps', 'Criptografia e Gerenciamento de Chaves (KMS)', 'OAuth2 / SAML / mTLS', 'Ferramentas SAST/DAST', 'Tolerância a Falhas (Circuit Breaker)'],
    businessAndLeadership: ['Governança de Segurança e LGPD', 'Análise de Risco Cibernético', 'Continuidade de Negócios e Disaster Recovery'],
    durationWeeks: 10,
    deliverables: ['Arquitetura endurecida (Hardened)', 'Relatório de auditoria de vulnerabilidades e correção', 'Mecanismos de failover testados'],
    idealPartnerProfile: 'Sistemas que lidam com dados sensíveis (saúde, financeiro, recursos humanos), aplicações bancárias, autenticação centralizada corporativa.',
    complexity: 'Avançado',
    pdfUrl: 'https://www.inteli.edu.br/wp-content/uploads/2026/07/Modulo-8-Arquitetura-digital-segura-e-tolerante-a-falhas-ES.pdf',
    partnerPortalUrl: 'https://web.inteli.edu.br/projetos-parceiros?codigo=ESMD8'
  },
  {
    id: 'ESMD9',
    code: 'ESMD9',
    controlCode: 'Módulo 09_ES',
    course: 'Engenharia de Software',
    moduleNumber: 9,
    year: 3,
    quarter: '1º TRI',
    name: 'Módulo 09_ES - Sistema digital resiliente com qualidade como ativo de software',
    metaprojectName: 'Sistema digital resiliente com qualidade como ativo de software',
    summary: 'Engenharia de qualidade de software, testes automatizados ponta a ponta, testes de estresse e confiabilidade para redução drástica de bugs em produção.',
    techStack: ['Cypress / Playwright / Jest', 'Testes de Carga (k6, JMeter)', 'Chaos Engineering (Chaos Mesh)', 'Sistemas de Monitoramento (Prometheus, Grafana)'],
    businessAndLeadership: ['Qualidade como Vantagem Competitiva', 'Custo do Retrabalho e Débito Técnico', 'Métricas de Engenharia (DORA Metrics)'],
    durationWeeks: 10,
    deliverables: ['Suíte de testes automatizados com alta cobertura', 'Simulações de caos e resiliência com validação', 'Dashboard de monitoramento de integridade'],
    idealPartnerProfile: 'Sistemas em expansão com instabilidade frequente, transição de sistemas legados para arquiteturas modernas, plataformas de checkout.',
    complexity: 'Avançado',
    pdfUrl: 'https://www.inteli.edu.br/wp-content/uploads/2026/07/Modulo-9-Sistema-digital-resiliente-com-qualidade-como-ativo-de-software-ES.pdf',
    partnerPortalUrl: 'https://web.inteli.edu.br/projetos-parceiros?codigo=ESMD9'
  },
  {
    id: 'ESMD10',
    code: 'ESMD10',
    controlCode: 'Módulo 10_ES',
    course: 'Engenharia de Software',
    moduleNumber: 10,
    year: 3,
    quarter: '2º TRI',
    name: 'Módulo 10_ES - Esteira ágil de produção de software',
    metaprojectName: 'Esteira ágil de produção de software',
    summary: 'Construção de esteiras completas de CI/CD, automação de deploys e entrega contínua (GitOps) com controle de qualidade integrado para acelerar times de engenharia.',
    techStack: ['GitHub Actions / GitLab CI', 'Kubernetes / ArgoCD / Helm', 'Terraform (IaC)', 'Gerenciamento de Artefatos', 'Observabilidade e Rollback Automatizado'],
    businessAndLeadership: ['Time to Market e Agilidade Organizacional', 'Cultura DevOps', 'Governança de Releases'],
    durationWeeks: 10,
    deliverables: ['Pipeline de CI/CD automatizado ponta a ponta', 'Infraestrutura como Código provisionada', 'Estratégia de Blue-Green ou Canary Deployment testada'],
    idealPartnerProfile: 'Empresas buscando modernizar o ciclo de deploy de software, padronizar práticas de desenvolvimento em múltiplos times e acelerar entregas.',
    complexity: 'Avançado',
    pdfUrl: 'https://www.inteli.edu.br/wp-content/uploads/2026/07/Modulo-10-Esteira-agil-de-producao-de-software-ES.pdf',
    partnerPortalUrl: 'https://web.inteli.edu.br/projetos-parceiros?codigo=ESMD10'
  },
  {
    id: 'ESMD11',
    code: 'ESMD11',
    controlCode: 'Módulo 11_ES',
    course: 'Engenharia de Software',
    moduleNumber: 11,
    year: 3,
    quarter: '3º TRI',
    name: 'Módulo 11_ES - Arquitetura e governança de dados alinhada à estratégia corporativa',
    metaprojectName: 'Arquitetura e governança de dados alinhada à estratégia corporativa',
    summary: 'Definição de arquitetura de dados corporativa em larga escala (Data Mesh, Data Lakehouse) com governança de dados, linhagem e catalogação.',
    techStack: ['Apache Spark / Databricks / Snowflake', 'dbt (data build tool)', 'Data Catalogs & Lineage (OpenMetadata)', 'Data Quality (Great Expectations)'],
    businessAndLeadership: ['Estratégia Corporativa Orientada a Dados (Data-Driven)', 'Governança de Dados e Compliance', 'Democratização de Dados'],
    durationWeeks: 10,
    deliverables: ['Arquitetura de dados corporativa modelada', 'Pipeline de transformação com dbt e testes de qualidade', 'Catálogo de dados com linhagem documentada'],
    idealPartnerProfile: 'Grandes organizações com silos de dados fragmentados, projetos de fusão e aquisição, planejamento estratégico de dados.',
    complexity: 'Avançado',
    pdfUrl: 'https://www.inteli.edu.br/wp-content/uploads/2026/07/Modulo-11-Arquitetura-e-governanca-de-dados-alinhada-a-estrategia-corporativa-ES.pdf',
    partnerPortalUrl: 'https://web.inteli.edu.br/projetos-parceiros?codigo=ESMD11'
  },

  // ==========================================
  // SISTEMAS DE INFORMAÇÃO (SI)
  // ==========================================
  {
    id: 'SIMD5',
    code: 'SIMD5',
    controlCode: 'Módulo 05_SI',
    course: 'Sistemas de Informação',
    moduleNumber: 5,
    year: 2,
    quarter: '1º TRI',
    name: 'Módulo 05_SI - Software descentralizado utilizando Blockchain',
    metaprojectName: 'Software descentralizado utilizando Blockchain',
    summary: 'Desenvolvimento de aplicações descentralizadas (DApps) com contratos inteligentes para rastreabilidade imutável, certificação e segurança de registros.',
    techStack: ['Solidity / Ethereum / Polygon / Hyperledger', 'Ethers.js / Web3.js', 'Hardhat / Foundry', 'IPFS para Armazenamento Descentralizado', 'Node.js Backend'],
    businessAndLeadership: ['Tokenomics e Modelos de Confiança Descentralizada', 'Auditoria de Processos', 'Rastreabilidade de Cadeias de Suprimentos'],
    durationWeeks: 10,
    deliverables: ['Smart Contracts auditados e testados', 'DApp web integrada com carteiras (MetaMask)', 'Documentação de segurança e custos de gas'],
    idealPartnerProfile: 'Rastreabilidade de supply chain, diplomas e certificados digitais imutáveis, votações auditáveis, registros de propriedade e cartorários.',
    complexity: 'Intermediário',
    pdfUrl: 'https://www.inteli.edu.br/wp-content/uploads/2026/07/Modulo-05-Software-Descentralizado-Blockchain-SI.pdf',
    partnerPortalUrl: 'https://web.inteli.edu.br/projetos-parceiros?codigo=SIMD5'
  },
  {
    id: 'SIMD6',
    code: 'SIMD6',
    controlCode: 'Módulo 06_SI',
    course: 'Sistemas de Informação',
    moduleNumber: 6,
    year: 2,
    quarter: '2º TRI',
    name: 'Módulo 06_SI - Aplicação baseada em Processamento em Linguagem Natural',
    metaprojectName: 'Aplicação baseada em Processamento em Linguagem Natural',
    summary: 'Construção de aplicações corporativas focadas em inteligência textual, análise de sentimentos de clientes, categorização de tickets e bots inteligentes.',
    techStack: ['Python', 'Spacy / NLTK / Scikit-learn', 'Modelos Pré-treinados de PLN', 'APIs de Mensageria e Webhooks', 'Bancos de Dados para Logs Textuais'],
    businessAndLeadership: ['Voz do Cliente (Voice of Customer - VoC)', 'Automação de Backoffice e Suporte', 'Eficiência em Operações de Atendimento'],
    durationWeeks: 10,
    deliverables: ['Motor de classificação textual treinado', 'Integração com sistema de chamados ou chat', 'Painel analítico de tópicos e sentimentos'],
    idealPartnerProfile: 'Classificação de e-mails e chamados de suporte, análise de comentários em redes sociais, triagem de processos administrativos.',
    complexity: 'Intermediário',
    pdfUrl: 'https://www.inteli.edu.br/wp-content/uploads/2026/07/Modulo-06-Aplicacoes-em-Processamento-de-Linguagem-Natural-SI.pdf',
    partnerPortalUrl: 'https://web.inteli.edu.br/projetos-parceiros?codigo=SIMD6'
  },
  {
    id: 'SIMD7',
    code: 'SIMD7',
    controlCode: 'Módulo 07_SI',
    course: 'Sistemas de Informação',
    moduleNumber: 7,
    year: 2,
    quarter: '3º TRI',
    name: 'Módulo 07_SI - Sistemas de Gestão e Governança Empresarial',
    metaprojectName: 'Sistemas de Gestão e Governança Empresarial',
    summary: 'Modelagem, implantação e integração de sistemas corporativos de gestão (ERP, CRM, SCM) com governança de processos de negócios e conformidade empresarial.',
    techStack: ['Arquitetura de Sistemas Integrados', 'ERPs e CRMs', 'Modelagem BPMN e Process Mining', 'APIs de Integração Corporativa', 'Bancos de Dados Transacionais'],
    businessAndLeadership: ['Gestão por Processos (BPM)', 'Governança Corporativa (COBIT, ITIL)', 'Transformação Digital em Operações', 'Compliance'],
    durationWeeks: 10,
    deliverables: ['Mapeamento de processos As-Is e To-Be com BPMN', 'Módulo de integração de sistemas implementado', 'Relatórios executivos de eficiência'],
    idealPartnerProfile: 'Integração de processos entre departamentos, modernização de rotinas fiscais e contábeis, gestão unificada de clientes e suprimentos.',
    complexity: 'Intermediário',
    pdfUrl: 'https://www.inteli.edu.br/wp-content/uploads/2026/07/Modulo-07-Sistemas-Gestao-Governanca-Empresarial-SI.pdf',
    partnerPortalUrl: 'https://web.inteli.edu.br/projetos-parceiros?codigo=SIMD7'
  },
  {
    id: 'SIMD8',
    code: 'SIMD8',
    controlCode: 'Módulo 08_SI',
    course: 'Sistemas de Informação',
    moduleNumber: 8,
    year: 2,
    quarter: '4º TRI',
    name: 'Módulo 08_SI - Integração, Gerenciamento e Análise de Big Data',
    metaprojectName: 'Integração, Gerenciamento e Análise de Big Data',
    summary: 'Engenharia de Big Data para ingestão, tratamento e disponibilização de dados em escala massiva para fins analíticos em tempo hábil.',
    techStack: ['Apache Spark / PySpark', 'Hadoop / HDFS / S3', 'Data Warehouses (BigQuery / Redshift / Snowflake)', 'Airflow para Orquestração', 'SQL Avançado'],
    businessAndLeadership: ['Cultura de Dados e Gestão Analítica', 'Custo de Armazenamento e Performance', 'SLA de Disponibilidade de Dados'],
    durationWeeks: 10,
    deliverables: ['Data pipeline orquestrado e automatizado', 'Tabelas modeladas no Data Warehouse', 'Documentação de linhagem e dicionário de dados'],
    idealPartnerProfile: 'Empresas com alto volume de transações diárias (e-commerce, telecom, finanças), consolidação de múltiplas fontes analíticas.',
    complexity: 'Avançado',
    pdfUrl: 'https://www.inteli.edu.br/wp-content/uploads/2026/07/Modulo-08-Integracao-Gerenciamento-Analise-Big-Data-SI.pdf',
    partnerPortalUrl: 'https://web.inteli.edu.br/projetos-parceiros?codigo=SIMD8'
  },
  {
    id: 'SIMD9',
    code: 'SIMD9',
    controlCode: 'Módulo 09_SI',
    course: 'Sistemas de Informação',
    moduleNumber: 9,
    year: 3,
    quarter: '1º TRI',
    name: 'Módulo 09_SI - Relatórios e Painéis de Controle de Dados Gerenciais',
    metaprojectName: 'Relatórios e Painéis de Controle de Dados Gerenciais',
    summary: 'Design e implementação de relatórios e painéis de controle de dados gerenciais (Business Intelligence executivo) focados em métricas estratégicas e suporte a tomadores de decisão.',
    techStack: ['Power BI / Tableau / Metabase', 'Modelagem Dimensional (Star Schema, Snowflake)', 'SQL Analítico / DAX', 'ETL de Consolidação'],
    businessAndLeadership: ['Definição de OKRs e KPIs Executivos', 'Data Visualization e Storytelling', 'Apoio à Decisão C-Level'],
    durationWeeks: 10,
    deliverables: ['Dashboard interativo gerencial funcional', 'Modelagem dimensional documentada', 'Dicionário de métricas e regras de negócio'],
    idealPartnerProfile: 'Diretorias que precisam de visão unificada de vendas, custos, produtividade ou operações em tempo hábil para decisões ágeis.',
    complexity: 'Avançado',
    pdfUrl: 'https://www.inteli.edu.br/wp-content/uploads/2026/07/Modulo-09-Relatorios-Paineis-Controle-Dados-Gerenciais-SI.pdf',
    partnerPortalUrl: 'https://web.inteli.edu.br/projetos-parceiros?codigo=SIMD9'
  },
  {
    id: 'SIMD10',
    code: 'SIMD10',
    controlCode: 'Módulo 10_SI',
    course: 'Sistemas de Informação',
    moduleNumber: 10,
    year: 3,
    quarter: '2º TRI',
    name: 'Módulo 10_SI - Análise Comportamental de Usuários de Interface Digitais',
    metaprojectName: 'Análise Comportamental de Usuários de Interface Digitais',
    summary: 'Análise aprofundada de comportamento de usuários em interfaces digitais com dados de navegação, funis de conversão, mapas de calor e testes A/B para maximizar conversão e retenção.',
    techStack: ['Product Analytics (Mixpanel, Amplitude, GA4)', 'Análise Estatística de Testes A/B', 'Python / Pandas para Cohort Analysis', 'Ferramentas de Heatmap e Sessão'],
    businessAndLeadership: ['Product Growth e Otimização de Funil', 'Psicologia do Consumidor e UX Research', 'Retenção e LTV (Lifetime Value)'],
    durationWeeks: 10,
    deliverables: ['Estudo comportamental com identificação de gargalos', 'Desenho e execução de testes A/B', 'Recomendações acionáveis de produto digital'],
    idealPartnerProfile: 'Plataformas SaaS, e-commerces com taxa de abandono de carrinho, portais digitais com necessidade de elevar o engajamento do usuário.',
    complexity: 'Avançado',
    pdfUrl: 'https://www.inteli.edu.br/wp-content/uploads/2026/07/Modulo-10-Analise-Comportamental-Usuarios-Interfaces-Digitais-SI.pdf',
    partnerPortalUrl: 'https://web.inteli.edu.br/projetos-parceiros?codigo=SIMD10'
  },
  {
    id: 'SIMD11',
    code: 'SIMD11',
    controlCode: 'Módulo 11_SI',
    course: 'Sistemas de Informação',
    moduleNumber: 11,
    year: 3,
    quarter: '3º TRI',
    name: 'Módulo 11_SI - Modelo Preditivo em aplicações de negócios utilizando Deep learning',
    metaprojectName: 'Modelo Preditivo em aplicações de negócios utilizando Deep learning',
    summary: 'Desenvolvimento de modelos preditivos complexos com redes neurais profundas integrados a sistemas transacionais de negócio para decisões críticas de alta precisão.',
    techStack: ['Python', 'TensorFlow / Keras / PyTorch', 'Pipelines de MLOps', 'APIs de Inferência em Baixa Latência', 'Monitoramento de Data Drift'],
    businessAndLeadership: ['Impacto Financeiro de Modelos de IA', 'Governança e Explicabilidade de IA nos Negócios', 'Gestão de Risco Operacional'],
    durationWeeks: 10,
    deliverables: ['Modelo de Deep Learning treinado para a dor de negócio', 'API REST de predição em tempo real', 'Relatório de retorno financeiro e acurácia'],
    idealPartnerProfile: 'Análise de risco de crédito, prevenção a fraudes em tempo real, predição de demanda complexa multivariada em grandes redes.',
    complexity: 'Avançado',
    pdfUrl: 'https://www.inteli.edu.br/wp-content/uploads/2026/07/Modulo-11-Modelo-Preditivo-Deep-Learning-SI.pdf',
    partnerPortalUrl: 'https://web.inteli.edu.br/projetos-parceiros?codigo=SIMD11'
  },

  // ==========================================
  // ADM TECH (ADMINISTRAÇÃO COM TECNOLOGIA)
  // ==========================================
  {
    id: 'ADMD5',
    code: 'ADMD5',
    controlCode: 'Módulo 05_AD',
    course: 'ADM Tech',
    moduleNumber: 5,
    year: 2,
    quarter: '1º TRI',
    name: 'Módulo 05_AD - Modelagem financeira e valuation',
    metaprojectName: 'Modelagem financeira e valuation',
    summary: 'Modelagem financeira avançada, avaliação de empresas (Valuation por DCF e Múltiplos), análise de sensibilidade e projeções econômico-financeiras.',
    techStack: ['Modelagem Financeira Avançada', 'Python para Finanças', 'Excel / Sheets Financeiro', 'Bancos de Dados Econômicos (Economatica, Bloomberg)'],
    businessAndLeadership: ['Valuation de Startups e Empresas Maduras', 'Estrutura de Capital e Custo Médio Ponderado (WACC)', 'Pitch para Investidores e M&A'],
    durationWeeks: 10,
    deliverables: ['Modelo de Valuation dinâmico completo', 'Análise de sensibilidade e cenários (Bear/Base/Bull)', 'Relatório executivo para comitê de investimentos'],
    idealPartnerProfile: 'Startups em rodada de captação, empresas avaliando fusões e aquisições (M&A), novos projetos de investimento corporativo ou spin-offs.',
    complexity: 'Intermediário',
    pdfUrl: 'https://www.inteli.edu.br/wp-content/uploads/2026/08/Modulo-5-Modelagem-Financeira-e-Valuation-ADM-TECH.pdf',
    partnerPortalUrl: 'https://web.inteli.edu.br/projetos-parceiros?codigo=ADMD5'
  },
  {
    id: 'ADMD6',
    code: 'ADMD6',
    controlCode: 'Módulo 06_AD',
    course: 'ADM Tech',
    moduleNumber: 6,
    year: 2,
    quarter: '2º TRI',
    name: 'Módulo 06_AD - Sistemas de Business Intelligence para tomada de decisão',
    metaprojectName: 'Sistemas de Business Intelligence para tomada de decisão',
    summary: 'Construção de sistemas e processos de Business Intelligence focados em suporte à tomada de decisão estratégica de gestores e executivos (conduzido com literatura e práticas globais).',
    techStack: ['Power BI / Tableau', 'SQL para Negócios', 'Modelagem Dimensional de Indicadores', 'Automação de Relatórios Executivos'],
    businessAndLeadership: ['Tomada de Decisão Baseada em Fatos', 'Métricas de Rentabilidade e Eficiência', 'Apresentação Executiva'],
    durationWeeks: 10,
    deliverables: ['Painel executivo de tomada de decisão com drill-down', 'Framework de análise de rentabilidade por linha de negócio', 'Guia de decisões estratégicas'],
    idealPartnerProfile: 'Empresas necessitando profissionalizar o acompanhamento de margens, faturamento, eficiência operacional e KPIs estratégicos.',
    complexity: 'Intermediário',
    pdfUrl: 'https://www.inteli.edu.br/wp-content/uploads/2026/09/Modulo-6-Business-Intelligence-Systems-for-Decision-Making-ENGLISH-ADM-TECH.pdf',
    partnerPortalUrl: 'https://web.inteli.edu.br/projetos-parceiros?codigo=ADMD6'
  },
  {
    id: 'ADMD7',
    code: 'ADMD7',
    controlCode: 'Módulo 07_AD',
    course: 'ADM Tech',
    moduleNumber: 7,
    year: 2,
    quarter: '3º TRI',
    name: 'Módulo 07_AD - Blockchain, criptomoedas e tokenização de ativos',
    metaprojectName: 'Blockchain, criptomoedas e tokenização de ativos',
    summary: 'Estruturação de projetos de tokenização de ativos reais (RWA), modelos de negócios com criptoativos, finanças descentralizadas (DeFi) e governança Web3.',
    techStack: ['Padrões de Tokenização (ERC-20, ERC-721, ERC-3643)', 'Plataformas de Custódia e Emissão', 'Smart Contracts para Finanças', 'Modelos Regulatórios'],
    businessAndLeadership: ['Tokenização de Ativos Reais (RWA)', 'Regulação CVM e Banco Central', 'Novos Modelos de Liquidez e Financiamento'],
    durationWeeks: 10,
    deliverables: ['Estudo de viabilidade de tokenização de ativo real', 'Smart contract de emissão e regras de compliance', 'Plano de negócios e go-to-market regulatório'],
    idealPartnerProfile: 'Securitizadoras, fundos imobiliários, empresas do agro buscando financiamento via tokens, fintechs e instituições financeiras inovadoras.',
    complexity: 'Intermediário',
    pdfUrl: 'https://www.inteli.edu.br/wp-content/uploads/2026/09/Modulo-7-Blockchain-e-tokenizacao-de-ativos-ADM-TECH.pdf',
    partnerPortalUrl: 'https://web.inteli.edu.br/projetos-parceiros?codigo=ADMD7'
  },
  {
    id: 'ADMD8',
    code: 'ADMD8',
    controlCode: 'Módulo 08_AD',
    course: 'ADM Tech',
    moduleNumber: 8,
    year: 2,
    quarter: '4º TRI',
    name: 'Módulo 08_AD - Imersão no mercado financeiro',
    metaprojectName: 'Imersão no mercado financeiro',
    summary: 'Análise aprofundada da dinâmica do mercado financeiro, gestão de portfólios de investimento, análise de risco de mercado e estratégias quantitativas.',
    techStack: ['Python para Finanças Quantitativas', 'Simulações de Monte Carlo', 'Métricas de Risco (VaR, Sharpe, Beta)', 'Plataformas de Trading e Dados'],
    businessAndLeadership: ['Gestão de Risco e Portfólio', 'Macroeconomia Aplicada', 'Governança de Asset Management'],
    durationWeeks: 10,
    deliverables: ['Modelo de alocação ótima de portfólio', 'Simulação de cenários de estresse de mercado', 'Relatório de recomendações de alocação'],
    idealPartnerProfile: 'Assets, gestoras de patrimônio (family offices), mesas de tesouraria de bancos ou corretoras de valores.',
    complexity: 'Avançado',
    pdfUrl: 'https://www.inteli.edu.br/wp-content/uploads/2026/09/Modulo-8-Imersao-no-Mercado-Financeiro-ADM-TECH.pdf',
    partnerPortalUrl: 'https://web.inteli.edu.br/projetos-parceiros?codigo=ADMD8'
  },
  {
    id: 'ADMD9',
    code: 'ADMD9',
    controlCode: 'Módulo 09_AD',
    course: 'ADM Tech',
    moduleNumber: 9,
    year: 3,
    quarter: '1º TRI',
    name: 'Módulo 09_AD - Estratégias e soluções de growth marketing',
    metaprojectName: 'Estratégias e soluções de growth marketing',
    summary: 'Construção de estratégias data-driven de growth marketing, aquisição sustentável de clientes, experimentos de tração, métricas de CAC/LTV e funis de conversão acelerada.',
    techStack: ['Growth Hacking & Experimentos Rápidos', 'Analytics de Aquisição e Atribuição', 'Ferramentas de Marketing Automation', 'Testes A/B de Aquisição'],
    businessAndLeadership: ['Estratégia de Crescimento Exponencial', 'Economia Unitária (Unit Economics: CAC, LTV, Payback)', 'Posicionamento de Mercado'],
    durationWeeks: 10,
    deliverables: ['Framework de experimentos de growth', 'Otimização de canais de aquisição com dados reais', 'Dashboard de unit economics e projeções'],
    idealPartnerProfile: 'Empresas em fase de expansão de vendas digitais, lançamento de novos produtos ou canais, negócios de assinatura com foco em tração.',
    complexity: 'Avançado',
    partnerPortalUrl: 'https://web.inteli.edu.br/projetos-parceiros?codigo=ADMD9'
  },
  {
    id: 'ADMD10',
    code: 'ADMD10',
    controlCode: 'Módulo 10_AD',
    course: 'ADM Tech',
    moduleNumber: 10,
    year: 3,
    quarter: '2º TRI',
    name: 'Módulo 10_AD - Automação e robotização de processos de negócios',
    metaprojectName: 'Automação e robotização de processos de negócios',
    summary: 'Identificação de gargalos operacionais e implementação de automação robótica de processos (RPA) e IA aplicada a fluxos de trabalho administrativos e financeiros.',
    techStack: ['Ferramentas de RPA (UiPath, Power Automate, Python)', 'Process Mining para Identificação de Desperdícios', 'Integração de APIs Corporativas e OCR'],
    businessAndLeadership: ['Eficiência Operacional e Redução de Erro Humano', 'Gestão de Mudança Organizacional', 'Cálculo de Horas Poupadas e ROI de RPA'],
    durationWeeks: 10,
    deliverables: ['Robô de software (RPA) automatizando fluxo complexo', 'Mapeamento de ganhos de tempo e custo', 'Manual de sustentação do processo automatizado'],
    idealPartnerProfile: 'Empresas com alto volume de digitação manual de notas/contratos, conciliação bancária repetitiva, integração manual entre ERPs legados.',
    complexity: 'Avançado',
    partnerPortalUrl: 'https://web.inteli.edu.br/projetos-parceiros?codigo=ADMD10'
  },
  {
    id: 'ADMD11',
    code: 'ADMD11',
    controlCode: 'Módulo 11_AD',
    course: 'ADM Tech',
    moduleNumber: 11,
    year: 3,
    quarter: '4º TRI',
    name: 'Módulo 11_AD - People analytics e eficiência de gestão',
    metaprojectName: 'People analytics e eficiência de gestão',
    summary: 'Aplicação de análise avançada de dados e modelos preditivos em recursos humanos para entender turnover, produtividade, clima organizacional e eficiência de equipes.',
    techStack: ['Python / R para Análise Estatística de Pessoas', 'Modelos Preditivos de Turnover e Retenção', 'Dashboards de People Analytics', 'Pesquisas de Clima e Redes Organizacionais (ONA)'],
    businessAndLeadership: ['Gestão Estratégica de Talentos', 'Cultura e Engajamento Organizacional', 'Ética no Uso de Dados de Colaboradores'],
    durationWeeks: 10,
    deliverables: ['Diagnóstico quantitativo de pessoas e turnover', 'Modelo preditivo de retenção de talentos críticos', 'Painel de métricas de eficiência de gestão'],
    idealPartnerProfile: 'Empresas com alta rotatividade de funcionários, organizações em crescimento acelerado buscando reter talentos e otimizar a performance de equipes.',
    complexity: 'Avançado',
    partnerPortalUrl: 'https://web.inteli.edu.br/projetos-parceiros?codigo=ADMD11'
  }
];

export function getModulesContextText(): string {
  const modulesText = INTELI_MODULES_CATALOG.map((m) => {
    return `
### [${m.code}] ${m.controlCode} - ${m.metaprojectName}
* **Código Oficial:** ${m.code}
* **Código Controle:** ${m.controlCode}
* **Curso:** ${m.course} (${m.year}º Ano, ${m.quarter})
* **Nome Canônico Oficial:** "${m.metaprojectName}"
* **Resumo Pedagógico:** ${m.summary}
* **Tecnologias (Tech Stack):** ${m.techStack.join(', ')}
* **Competências de Negócios/Liderança:** ${m.businessAndLeadership.join(', ')}
* **Perfil Ideal de Parceiro:** ${m.idealPartnerProfile}
* **Entregáveis Típicos:** ${m.deliverables.join(' | ')}
* **Ementa PDF:** ${m.pdfUrl || 'Disponível no Portal'}
* **Link Portal de Parcerias:** ${m.partnerPortalUrl}
`.trim();
  }).join('\n\n---\n\n');

  return `${modulesText}

================================================================================
# DIRETRIZES DE GOVERNANÇA, REGRAS DE NEGÓCIO E POLÍTICA DE ESCOPO DO ESCRITÓRIO DE PROJETOS (EP)
================================================================================

1. POSTURA CONSULTIVA E ACADÊMICA:
- Posicionamento de excelência: Faculdade com nota máxima (5) no MEC em todos os cursos de Graduação.
- Vocabulário proibido: Termos comerciais agressivos ("cobertura de 100% das demandas em um único ano", "esteiras contínuas de contratação", "pacotes em lote").
- Vocabulário correto: "Janelas de Oportunidade por Trimestre Letivo" ou "Matriz de Possibilidades Temporais".
- Princípio da Seleção Pontual: O padrão recomendado para parceiros é a escolha de 1 projeto por ciclo letivo (semestral ou anual) para garantir foco e profundidade pedagógica.
- Indicação obrigatória: Toda listagem ou opção deve explicitar o trimestre (1º Tri, 2º Tri, 3º Tri ou 4º Tri).

2. MODELO PEDAGÓGICO:
- Ciclos fixos de 10 semanas estruturados em 5 sprints quinzenais.
- Squads multidisciplinares de 6 a 8 estudantes, orientados por professores doutores e especialistas.
- Sem custo financeiro de desenvolvimento para o parceiro; 100% da propriedade intelectual e do código gerado são transferidos para a empresa parceira.
- Entregáveis: até 5 protótipos funcionais ou Provas de Conceito (PoCs) independentes por turma/módulo.
- Comprometimento do parceiro: Ponto focal técnico com ~30 horas disponíveis ao longo de 10 semanas (7 encontros chave: Onboarding, Kickoff, 4 Validações de Sprint e Apresentação Final).

3. CRITÉRIOS RÍGIDOS DE EXCLUSÃO (FRONTEIRAS DE ESCOPO - PROIBIDO):
- Proibido deployment final em produção comercial: Sem SLA de sustentação, suporte ou manutenção contínua pós-projeto.
- Proibida instalação física e manuseio em campo/rua: Estudantes não sobem em postes, vias públicas, subestações, linhas de transmissão ou ambientes fabris de risco.
- Proibido desenvolvimento de apps mobile fora de módulos específicos (permitido apenas em módulos com foco mobile como Módulo 6 de ES, Módulo 10 de EC ou Módulo 2 do 1º Ano).
- Proibida alteração direta em redes operacionais (TO) ou ERPs produtivos sem sandbox/staging isolado.
- Proibido treinamento de LLMs do zero ou uso de dados sensíveis sem anonimização prévia (LGPD).
- Proibida publicação em lojas de aplicativos (App Store / Google Play sob responsabilidade do parceiro).

4. DIRETRIZES DE CALIBRAÇÃO E "PIVÔ PEDAGÓGICO":
- O Princípio do "1 Nó Físico + N Nós Simulados": Em projetos de Cidades Inteligentes ou IoT em larga escala (ex: Módulo 9 de EC), a equipe desenvolve 1 protótipo físico funcional em bancada (ESP32/Raspberry Pi) e simula via software a telemetria e o tráfego de 100+ nós virtuais (Kafka/MQTT) para testar a escalabilidade.
- Substituição de Visão de Borda por Sensores de Presença/Wi-Fi Probe: Quando a captura de vídeo for inviável por limitações de hardware local, substitui-se por sensores de presença ou análise passiva de pacotes Wi-Fi.
- Fatiamento em Janelas Sequenciais: Desafios complexos de grande porte devem ser fatiados em maturidade:
  1) Bancada/IoT (Módulo 4 do 1º Ano)
  2) Rede/Ingestão distribuída (Módulo 9 de EC ou Módulo 8 de SI)
  3) Interface/Mobile (Módulo 10 de EC ou Módulo 6 de ES)
  4) Inteligência de Borda (Módulo 11 de EC ou Módulo 11 de SI)

================================================================================
# INVENTÁRIO TÉCNICO DE HARDWARES E EQUIPAMENTOS DO LABORATÓRIO INTELI
================================================================================
O Escritório de Projetos dispõe dos seguintes recursos físicos de bancada e laboratório:

1. Apple Mac mini M4 (2024) [11 Unidades]:
   - Chip M4 (10-core CPU, 10-core GPU, Neural Engine 16-core com 38 TOPS), 16GB RAM Unificada, 512GB SSD.
   - Aplicações: Compilação iOS nativa no Módulo 6 de ES e Módulo 10 de EC; apps híbridos (Flutter/React Native) e servidores de alta performance.

2. Workstation Dell Precision 3660 Tower [10 Unidades]:
   - Intel Core i7, 32GB RAM DDR5, SSD NVMe 2TB, GPU NVIDIA RTX A4000 (16GB VRAM GDDR6).
   - Aplicações: Módulo 3 do 1º Ano (Predição com IA), Módulo 9 de CC (Visão Computacional / CNNs), Módulo 8 de SI (Big Data / Spark), Módulo 7 de ES (NLP).

3. Workstation Dell Precision 5860 Tower [1 Unidade]:
   - Intel Xeon W-series, 64GB RAM ECC DDR5, SSD NVMe 2TB, GPU NVIDIA RTX A6000 (48GB VRAM GDDR6).
   - Aplicações: Módulo 10 de CC (Reinforcement Learning), Módulo 11 de CC (GenAI / LLMs / RAG denso) e Módulo 11 de SI (Deep Learning em Negócios).

4. Raspberry Pi 5 (4GB RAM) [11 Unidades]:
   - BCM2712 Quad-Core Cortex-A76 @ 2.4GHz, 4GB LPDDR4X, interface PCIe 2.0 nativa, suporte a câmeras/displays MIPI.
   - Aplicações: Módulo 4 do 1º Ano (IoT), Módulo 11 de EC (Edge Computing), Módulo 8 de CC (Dispositivos Sensoriais).

5. Robô Manipulador Dobot Magician Lite:
   - Braço robótico industrial educacional de 4 eixos, payload de 250g, repetibilidade 0.2mm, garras mecânicas, ventosa a vácuo e esteira rolante adaptável.
   - Aplicações: Módulo 5 de EC (Automação de Processos e Sistemas), Módulo 8 de EC (Robô de Serviço).

6. Robô Quadrúpede Autônomo Unitree Go2:
   - Robô quadrúpede bioinspirado com LiDAR 4D Ultra-Wide 360° x 90°, articulações de alto torque, Wi-Fi 6, câmeras HD frontais e rastreamento ISS 2.0.
   - Aplicações: Módulo 6 de EC (Robótica Móvel e Visão), Módulo 8 de EC (Robô de Serviço Autônomo com IA Generativa), Módulo 11 de EC (Edge AI).

7. Robô Móvel TurtleBot3 (Burger / Waffle Pi):
   - Plataforma robótica diferencial ROS / ROS 2 com LiDAR 360° 2D, motores DYNAMIXEL com encoders e odometria.
   - Aplicações: Módulo 6 de EC (Robótica Móvel), Módulo 8 de EC (SLAM / Mapeamento autônomo indoor).

8. Drones DJI para Inspeção Aérea e Fotogrametria:
   - Sensores de alta resolução 4K/8K, gimbal de 3 eixos, GPS/RTK e sensores de obstáculos omnidirecionais.
   - Aplicações: Módulo 9 de CC (Visão Computacional em Inspeção Aérea), Módulo 11 de EC (Edge Computing).
`;
}

