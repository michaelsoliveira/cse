import {
  Document,
  Page,
  Text,
  View,
  StyleSheet
} from '@react-pdf/renderer';
import { AvaliacaoPorMes, meses } from '../../utils';
import { OptionType } from '@/components/select-searchable';

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 8,
    fontFamily: 'Helvetica'
  },
  header: {
    marginBottom: 20,
    textAlign: 'center'
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  subTitle1: {
    fontSize: 14,
    marginTop: 4
  },
  subTitle2: {
    fontSize: 12,
    marginTop: 4
  },
  generatedAt: {
    fontSize: 9,
    marginTop: 2,
    color: '#555'
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottom: '1px solid #000',
    fontWeight: 'bold',
    marginBottom: 2
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottom: '0.5px solid #ccc'
  },
  cellCenter: {
    textAlign: 'center',
  },
  tableRowEven: {
    backgroundColor: '#f0f0f0' // cinza claro
  },
  tableRowOdd: {
    backgroundColor: '#ffffff' // branco (pode até omitir se quiser)
  },
  cellEscola: { flex: 3, paddingRight: 4 },
  cellMunicipio: { flex: 1.5 },
  cellMes: { flex: 1 }
});

type Props = {
  avaliacoes: AvaliacaoPorMes[];
};

const MESES = [
  'janeiro', 'fevereiro', 'marco', 'abril', 'maio',
  'junho', 'julho', 'agosto', 'setembro', 'outubro',
  'novembro', 'dezembro'
];

export function AvaliacaoPdf({ avaliacoes }: Props) {
  const dataAtual = new Date().toLocaleString('pt-BR');

  return (
    <Document>
      <Page orientation="landscape" size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Secretaria de Estado da Educação</Text>
          <Text style={styles.subTitle1}>Coordenadoria de Segurança Escolar</Text>
          <Text style={styles.subTitle2}>Relatório de Estado de Conservação</Text>
          <Text style={styles.generatedAt}>Gerado em: {dataAtual}</Text>
        </View>

        <View style={styles.tableHeader}>
          <Text style={styles.cellEscola}>ESCOLA</Text>
          <Text style={styles.cellMunicipio}>MUNICÍPIO</Text>
          {meses.map((mes: OptionType) => (
            <Text key={mes?.value} style={[styles.cellMes, styles.cellCenter]}>{String(mes?.value).charAt(0).toUpperCase() + String(mes?.value).toUpperCase().slice(1)}</Text>
          ))}
        </View>

        {avaliacoes.map((item, index) => (
          <View 
            key={index} 
            style={[
              styles.tableRow,
              index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
            ]}
            
          >
            <Text style={styles.cellEscola}>{item.escola}</Text>
            <Text style={styles.cellMunicipio}>{item.municipio}</Text>
            {meses.map((mes) => (
              <Text key={mes?.value} style={[styles.cellMes, styles.cellCenter]}>
                {item.avaliacoes?.[mes?.value] ?? '-'}
              </Text>
            ))}
          </View>
        ))}

        <Text
          style={{
            position: 'absolute',
            bottom: 30,
            left: 0,
            right: 30,
            textAlign: 'right',
            fontSize: 8,
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
