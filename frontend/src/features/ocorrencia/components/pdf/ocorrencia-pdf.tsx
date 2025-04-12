// components/pdf/OcorrenciaPdf.tsx
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica'
  },
  header: {
    marginBottom: 20,
    textAlign: 'center'
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  subTitle: {
    fontSize: 14,
    paddingTop: 4
  },
  subTitle2: {
    fontSize: 12,
    marginTop: 4
  },
  generatedAt: {
    fontSize: 10,
    marginTop: 4,
    color: '#555'
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottom: '1px solid #000',
    paddingBottom: 5,
    fontWeight: 'bold'
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 4,
    borderBottom: '0.5px solid #ccc'
  },
  cell: {
    flex: 1.5,
    paddingRight: 4
  },
  cellData: {
    flex: 0.75,
    paddingRight: 2
  },
  cellHora: {
    flex: 0.5,
    paddingRight: 2
  },
  cellEscola: {
    flex: 3,
    paddingRight: 4
  },
  cellClass: {
    flex: 1.5,
    paddingRight: 4
  }
});

type Ocorrencia = {
  data: string;
  hora: string;
  escola: string;
  tipo: string;
  comunicante: string;
  acionamento: string;
  classificacao: string;
};

type Props = {
  ocorrencias: Ocorrencia[];
};

export function OcorrenciaPdf({ ocorrencias }: Props) {
  const dataAtual = new Date().toLocaleString('pt-BR');

  return (
    <Document>
      <Page orientation='landscape' size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Secretaria de Estado da Educação</Text>
          <Text style={styles.subTitle}>Coordenadoria de Segurança Escolar</Text>
          <Text style={styles.subTitle2}>Relatório de Ocorrências</Text>
          <Text style={styles.generatedAt}>Gerado em: {dataAtual}</Text>
        </View>

        <View style={styles.tableHeader}>
          <Text style={styles.cellData}>Data</Text>
          <Text style={styles.cellHora}>Hora</Text>
          <Text style={styles.cellEscola}>Escola</Text>
          <Text style={styles.cell}>Tipo</Text>
          <Text style={styles.cell}>Comunicante</Text>
          <Text style={styles.cellClass}>Classificação</Text>
          <Text style={styles.cell}>Acionamento</Text>
        </View>

        {ocorrencias.map((oc, index) => (
          <View style={styles.tableRow} key={index}>
            <Text style={styles.cellData}>{oc.data}</Text>
            <Text style={styles.cellHora}>{oc.hora}</Text>
            <Text style={styles.cellEscola}>{oc.escola}</Text>
            <Text style={styles.cell}>{oc.tipo.toLocaleUpperCase()}</Text>
            <Text style={styles.cell}>{oc.comunicante.toUpperCase()}</Text>
            <Text style={styles.cellClass}>{oc.classificacao.toUpperCase()}</Text>
            <Text style={styles.cell}>{oc.acionamento.toLocaleUpperCase()}</Text>
          </View>
        ))}
          {/* Numeração da página */}
      <Text
        style={{
          position: 'absolute',
          bottom: 30,
          left: 0,
          right: 30,
          textAlign: 'right',
          fontSize: 10,
          color: '#555'
        }}
        render={({ pageNumber, totalPages }) =>
          `Página ${pageNumber} de ${totalPages}`
        }
      />
      </Page>
    </Document>
  );
}
