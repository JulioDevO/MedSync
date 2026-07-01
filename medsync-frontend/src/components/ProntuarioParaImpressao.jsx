import React from 'react';
import ReactDOM from 'react-dom';

// ============================================================
// PrintPortal: renderiza os filhos diretamente no <body>,
// fora de qualquer wrapper do dashboard. Isso garante que
// o @media print consiga esconder tudo com body > *:not(#print-portal)
// sem afetar nenhum elemento da UI.
// ============================================================
const PrintPortal = ({ children }) => {
  let portalNode = document.getElementById('print-portal');
  
  if (!portalNode) {
    portalNode = document.createElement('div');
    portalNode.id = 'print-portal';
    document.body.appendChild(portalNode);
  }

  return ReactDOM.createPortal(children, portalNode);
};


// ============================================================
// ProntuarioParaImpressao: layout de folha A4 polido.
// Estilo baseado em documentos médicos oficiais brasileiros.
// ============================================================
export const ProntuarioParaImpressao = React.forwardRef((props, ref) => {
  const { paciente, registro, formatarData } = props;

  if (!paciente || !registro) return null;

  return (
    <PrintPortal>
      <div
        ref={ref}
        style={{
          fontFamily: "'Georgia', 'Times New Roman', serif",
          fontSize: '11pt',
          lineHeight: '1.7',
          color: '#111',
          background: '#fff',
          padding: '0', // padding vem do @page margin
          maxWidth: '100%',
        }}
      >
        {/* ── CABEÇALHO ─────────────────────────────────────── */}
        <header style={{
          borderBottom: '3px double #111',
          paddingBottom: '16px',
          marginBottom: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}>
          <div>
            <div style={{ fontSize: '22pt', fontWeight: 'bold', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              MedSync
            </div>
            <div style={{ fontSize: '9pt', color: '#555', marginTop: '2px', letterSpacing: '0.05em' }}>
              Clínica Especializada · Documento Médico Oficial
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '9pt', color: '#555' }}>
            <div><strong>Data de emissão:</strong> {formatarData(registro.data)}</div>
            <div style={{ marginTop: '2px' }}>Gerado eletronicamente · MedSync v1.0</div>
          </div>
        </header>

        {/* ── DADOS DO PACIENTE ──────────────────────────────── */}
        <section style={{
          border: '1px solid #bbb',
          borderRadius: '4px',
          padding: '14px 18px',
          marginBottom: '28px',
          backgroundColor: '#fafafa',
        }}>
          <div style={{
            fontSize: '7.5pt',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: '#555',
            borderBottom: '1px solid #ccc',
            paddingBottom: '6px',
            marginBottom: '10px',
          }}>
            Identificação do Paciente
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10.5pt' }}>
            <tbody>
              <tr>
                <td style={{ paddingRight: '24px', paddingBottom: '4px' }}>
                  <span style={{ color: '#555', fontSize: '9pt' }}>Nome completo</span><br />
                  <strong>{paciente.nome}</strong>
                </td>
                <td style={{ paddingRight: '24px', paddingBottom: '4px' }}>
                  <span style={{ color: '#555', fontSize: '9pt' }}>CPF</span><br />
                  <strong>{paciente.cpf || '—'}</strong>
                </td>
                <td style={{ paddingBottom: '4px' }}>
                  <span style={{ color: '#555', fontSize: '9pt' }}>Convênio</span><br />
                  <strong>{paciente.convenio || 'Particular'}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* ── TÍTULO DO DOCUMENTO ────────────────────────────── */}
        <div style={{
          textAlign: 'center',
          marginBottom: '24px',
        }}>
          <div style={{
            display: 'inline-block',
            fontSize: '10pt',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            borderTop: '1px solid #aaa',
            borderBottom: '1px solid #aaa',
            padding: '6px 28px',
            color: '#222',
          }}>
            Evolução Clínica
          </div>
        </div>

        {/* ── CORPO CLÍNICO ──────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Queixa Principal */}
          <section>
            <div style={sectionLabelStyle}>1. Queixa Principal / Anamnese</div>
            <div style={sectionBodyStyle}>
              {registro.queixa}
            </div>
          </section>

          {/* Observações */}
          <section>
            <div style={sectionLabelStyle}>2. Observações e Conduta</div>
            <div style={sectionBodyStyle}>
              {registro.observacoes}
            </div>
          </section>

          {/* Prescrição */}
          <section>
            <div style={sectionLabelStyle}>3. Prescrição Médica</div>
            <div style={{ ...sectionBodyStyle, fontWeight: registro.prescricao ? '600' : 'normal' }}>
              {registro.prescricao || 'Sem prescrição nesta consulta.'}
            </div>
          </section>
        </div>

        {/* ── RODAPÉ / ASSINATURA ────────────────────────────── */}
        {/*
          Usar margin-top grande para empurrar para o final da folha.
          O padding-top garante o espaço visual da linha acima.
          page-break-inside: avoid previne que a assinatura quebre para próxima página.
        */}
        <footer style={{
          marginTop: '72px',
          pageBreakInside: 'avoid',
        }}>
          {/* Linha de assinatura */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
          }}>
            <div style={{ textAlign: 'center', width: '280px' }}>
              <div style={{
                borderTop: '1.5px solid #111',
                paddingTop: '8px',
                marginBottom: '4px',
              }} />
              <div style={{ fontSize: '10pt', fontWeight: 'bold' }}>Assinatura e Carimbo do Médico</div>
              <div style={{ fontSize: '8.5pt', color: '#666', marginTop: '4px' }}>CRM: ___________________</div>
            </div>
          </div>

          {/* Rodapé de autenticidade */}
          <div style={{
            borderTop: '1px solid #ddd',
            marginTop: '28px',
            paddingTop: '10px',
            textAlign: 'center',
            fontSize: '7.5pt',
            color: '#999',
            letterSpacing: '0.03em',
          }}>
            Documento gerado eletronicamente pelo sistema MedSync · Autenticidade verificável pelo administrador do sistema.
          </div>
        </footer>
      </div>
    </PrintPortal>
  );
});

// ── Estilos compartilhados para seções ──────────────────────

const sectionLabelStyle = {
  fontSize: '8pt',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: '0.15em',
  color: '#444',
  marginBottom: '6px',
  paddingBottom: '4px',
  borderBottom: '1px solid #ddd',
};

const sectionBodyStyle = {
  fontSize: '11pt',
  lineHeight: '1.75',
  color: '#222',
  whiteSpace: 'pre-wrap',
  padding: '10px 14px',
  border: '1px solid #e8e8e8',
  borderRadius: '3px',
  minHeight: '48px',
};