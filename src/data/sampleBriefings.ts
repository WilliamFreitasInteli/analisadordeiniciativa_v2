export interface SampleBriefing {
  id: string;
  title: string;
  category: 'Múltiplas Iniciativas' | 'Indústria & IoT' | 'Fintech & Dados' | 'Varejo & Web' | 'Logística & Otimização';
  description: string;
  companyName: string;
  sourceType: 'Planilha / Múltiplas Demandas' | 'Briefing Executivo' | 'Transcrição de Reunião' | 'Relatório de Diagnóstico';
  rawContent: string;
}

export const SAMPLE_BRIEFINGS: SampleBriefing[] = [
  {
    id: 'sample-multiplas-iniciativas',
    title: 'Hospital & Rede de Saúde: 3 Desafios Estratégicos',
    category: 'Múltiplas Iniciativas',
    companyName: 'Rede Hospitalar São Lucas',
    sourceType: 'Planilha / Múltiplas Demandas',
    description: 'Um e-mail da diretoria com 3 demandas misturadas: monitoramento térmico de vacinas, previsão de no-show em consultas e portal de agendamento.',
    rawContent: `De: Diretoria de Inovação e Operações - Rede Hospitalar São Lucas
Para: Coordenação de Projetos - INTELI
Assunto: Propostas de Parceria para o Próximo Ciclo de Projetos

Prezada equipe do Inteli,
Gostaríamos de submeter 3 demandas reais e prioritárias que identificamos em nossas unidades hospitalares para que os alunos possam desenvolver protótipos funcionais conosco:

Demanda A - Rastreabilidade Térmica da Cadeia de Frio das Vacinas:
Hoje temos perdas expressivas por variações de temperatura em geladeiras hospitalares e no transporte interno de bolsas de vacinas e hemoderivados. Precisamos de uma solução com pequenos sensores que meçam temperatura e umidade minuto a minuto, transmitam esses dados via Wi-Fi/MQTT para a nuvem e disparem alertas imediatos caso a temperatura saia da faixa de 2°C a 8°C, com um painel em tempo real para a equipe de enfermagem.

Demanda B - Predição de Faltas (No-Show) em Consultas Especializadas:
Temos uma taxa de absenteísmo de 24% em exames de ressonância e consultas cardiológicas, gerando ociosidade de médicos e equipamentos caros. Temos um histórico de 3 anos em planilha com perfil do paciente, distância, horário, histórico de faltas e tipo de convênio. Gostaríamos de um modelo preditivo em Machine Learning que calcule a probabilidade de falta de cada paciente 48h antes, para que nossa central possa fazer sobre-agendamento inteligente ou reconfirmação ativa.

Demanda C - Portal de Teleorientação e Triagem de Pacientes Pós-Alta:
Nossos pacientes que recebem alta cirúrgica muitas vezes têm dúvidas simples em casa e acabam retornando ao pronto-socorro sem necessidade. Precisamos de uma plataforma web intuitiva (responsiva para celular e desktop) onde o paciente ou familiar acesse as instruções pós-operatórias personalizadas pelo médico, tire dúvidas por um canal estruturado com a enfermagem e preencha um diário de recuperação diário com CRUD completo e controle de acesso seguro por perfil de usuário.`
  },
  {
    id: 'sample-logistica-otimizacao',
    title: 'Empresa de Logística: Roteamento & Otimização de Frotas',
    category: 'Logística & Otimização',
    companyName: 'TransExpress Logística S/A',
    sourceType: 'Briefing Executivo',
    description: 'Desafio focado em otimização de rotas de entrega de última milha (last-mile) com restrições de janelas de tempo e cubagem.',
    rawContent: `Empresa: TransExpress Logística S/A
Contato: Gerência de Engenharia e Operações
Desafio Proposto:
Nossa operação na Grande São Paulo realiza mais de 15.000 entregas diárias com uma frota terceirizada de 450 vans e caminhões urbanos. O problema atual é que o planejamento de rotas é feito de forma semi-manual por supervisores regionais, resultando em sobreposição de trajetos, elevado consumo de diesel e perda de janelas de entrega contratadas com clientes B2B.

O que buscamos com o Inteli:
Queremos o desenvolvimento de um motor de otimização combinatória e pesquisa operacional que receba diariamente a lista de pontos de entrega com latitude/longitude, peso/volume das caixas e a janela horária exigida por cada lojista. O algoritmo deve calcular as rotas ótimas minimizando a quilometragem total rodada e respeitando a capacidade máxima de carga de cada veículo (Vehicle Routing Problem with Time Windows - VRPTW), entregando os planos em uma interface interativa com visualização dos mapas e percentual de economia estimado.`
  },
  {
    id: 'sample-industria-40',
    title: 'Siderúrgica & Manufatura: Manutenção Preditiva com Sensores',
    category: 'Indústria & IoT',
    companyName: 'Aços & Metais do Brasil',
    sourceType: 'Briefing Executivo',
    description: 'Monitoramento de esteiras e motores fabris utilizando acelerômetros, telemetria em tempo real e sensores conectados.',
    rawContent: `Parceiro: Aços & Metais do Brasil - Unidade Industrial Tubarão
Área: Manutenção Eletromecânica

Contexto do Problema:
Nossa linha de laminação opera 24/7. Quando um motor de indução de 200kW ou o redutor mecânico de uma esteira falha subitamente por desgaste de rolamento ou desalinhamento, a parada de linha custa mais de R$ 80.000 por hora.
Hoje as rondas com medidores manuais ocorrem apenas a cada 15 dias.

Objetivo do Projeto:
Desenvolver um sistema ciberfísico com microcontroladores (ESP32) instalados nas carcaças dos 8 motores principais da linha piloto, coletando leituras de temperatura de mancais (termopares) e vibração contínua (acelerômetros piezoelétricos ou MEMS). Os dados devem ser transmitidos por protocolo industrial/MQTT para um broker local e nuvem, gerando gráficos de tendência temporal e alarmes de ultrapassagem de limiares de segurança para os operadores na sala de comando.`
  },
  {
    id: 'sample-fintech-credito',
    title: 'Fintech de Crédito: Modelagem de Risco e Inadimplência',
    category: 'Fintech & Dados',
    companyName: 'CredSimples Soluções Financeiras',
    sourceType: 'Relatório de Diagnóstico',
    description: 'Construção de modelo preditivo com machine learning supervisionado para concessão de crédito para MEIs e pequenas empresas.',
    rawContent: `Organização: CredSimples Soluções Financeiras
Público Alvo: Microempreendedores Individuais (MEIs) e PMEs

Situação Atual:
Atualmente, nossa esteira de concessão de microcrédito reprova 65% dos pedidos por falta de score tradicional em bureaus de crédito (como Serasa/Boa Vista), já que muitos pequenos empreendedores são desbancarizados ou recém-formalizados. No entanto, temos acesso consentido ao extrato bancário via Open Finance e histórico de faturamento via maquininhas de cartão dos últimos 12 meses (base de 80.000 registros históricos anonimizados).

Desafio para os Alunos:
Construir um pipeline completo de ciência de dados e machine learning para prever a probabilidade de default (inadimplência superior a 90 dias nos primeiros 6 meses de contrato). O modelo deve identificar as variáveis financeiras mais preditivas, testar algoritmos de classificação supervisionada (como XGBoost, Random Forest e Regressão Logística com balanceamento de classes), apresentar métricas de ROC-AUC e KS, e entregar um simulador interativo onde o analista de crédito possa simular a probabilidade de risco de uma nova proposta.`
  },
  {
    id: 'sample-audio-transcription',
    title: 'Transcrição de Áudio de Alinhamento: 2 Iniciativas de Varejo',
    category: 'Varejo & Web',
    companyName: 'Lojas VarejoTotal',
    sourceType: 'Transcrição de Reunião',
    description: 'Transcrição de reunião com o Diretor de TI abordando gamificação para jovens aprendizes e app web de inventário.',
    rawContent: `[Transcrição de Reunião de Alinhamento via Meet - Duração: 14 min]
Participantes: Carlos Eduardo (VP de Operações VarejoTotal), Marina Prado (Head de Pessoas), Coordenação de Projetos Inteli.

Carlos Eduardo: "Bom dia pessoal do Inteli! Prazer enorme conversar com vocês. A gente acompanhou os projetos que vocês fizeram no ano passado e ficamos muito impressionados. Basicamente a gente tem duas grandes dores aqui na rede hoje, e queríamos ver se os módulos de vocês conseguem abraçar.

Primeira dor: a gente contrata cerca de 600 jovens aprendizes e operadores de caixa a cada trimestre. O treinamento de boas práticas de atendimento e prevenção de perdas hoje é um PDF chato de 80 páginas que ninguém lê. A gente queria transformar isso num jogo de computador bem dinâmico, um game 2D onde o personagem atende clientes na loja, toma decisões rápidas sobre devoluções, precificação e atendimento empático, acumulando pontos e passando de fases. Isso precisa ser muito divertido e engajador para o público jovem.

Segunda dor: nossas equipes de loja perdem cerca de 3 horas por dia conferindo itens em estoque de forma manual com pranchetas de papel para alimentar depois o sistema. Nós precisamos de um sistema web simples e responsivo, que rode tanto no celular dos estoquistas quanto no computador do gerente da loja. Precisa ter cadastro de produtos, registro de entradas e saídas de mercadorias, tela de conciliação de divergências e um relatório de perdas por filial, com controle de perfil de quem é estoquista e quem é gerente."`
  }
];
