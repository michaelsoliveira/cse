// components/pdf/OcorrenciaPDFDocument.tsx

import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Font
  } from '@react-pdf/renderer';
  import { format } from 'date-fns';
  import { ptBR } from 'date-fns/locale';
import { ocorrencias_acionamento, ocorrencias_classificacao } from '../ocorrencia-tables/use-ocorrencia-table-filters';
  
  const styles = StyleSheet.create({
    page: {
      padding: 30,
      fontSize: 11,
      fontFamily: 'Helvetica',
    },
    title: {
      fontSize: 16,
      textAlign: 'center',
      fontWeight: 'bold',
      marginBottom: 20
    },
    table: {
      display: 'flex',
      width: '100%',
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: '#000',
      marginBottom: 12,
    },
    row: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#000',
    },
    cell: {
      flex: 1,
      padding: 6,
      borderRightWidth: 1,
      borderRightColor: '#000',
    },
    lastCell: {
      borderRightWidth: 0,
    },
    label: {
      fontWeight: 'bold'
    },
    section: {
      marginBottom: 12
    },
    assinatura: {
      marginTop: 30,
    },
    footer: {
      marginTop: 40,
      fontSize: 10,
      textAlign: 'right',
      fontStyle: 'italic',
    },
    textareaBox: {
        borderWidth: 1,
        borderColor: '#000',
        borderStyle: 'solid',
        padding: 6,
        minHeight: 100,
        width: '100%',
        marginTop: 4,
    }
  });
  
  export function BoletimOcorrenciaPdf({ ocorrencia }: { ocorrencia: any }) {
    const data = format(new Date(ocorrencia.data), 'dd/MM/yyyy', { locale: ptBR });
    const hora = format(new Date(ocorrencia.hora), 'HH:mm', { locale: ptBR });
    const dataAtual = format(new Date(), 'dd/MM/yyyy', { locale: ptBR });
    const nomeEscola = ocorrencia.unidade_escolar?.pessoa?.pessoaJuridica?.nome_fantasia || 'Unidade Escolar';
  
    return (
      <Document>
        <Page size="A4" style={styles.page}>
        <Text style={styles.title}>BOLETIM DE OCORRÊNCIA</Text>

        {/* Tabela de dados principais */}
        <View style={styles.table}>
            <View style={styles.row}>
                <View style={styles.cell}><Text><Text style={styles.label}>B.O. Nº:</Text> {ocorrencia.id.slice(0, 6)}</Text></View>
                <View style={[styles.cell, styles.lastCell]}><Text><Text style={styles.label}>Data:</Text> {data} às {hora}</Text></View>
            </View>
            <View style={styles.row}>
                <View style={styles.cell}><Text><Text style={styles.label}>Tipo:</Text> {ocorrencia.tipo_ocorrencia?.nome}</Text></View>
                <View style={[styles.cell, styles.lastCell]}>
                    <Text>
                        <Text style={styles.label}>Classificação:</Text> {ocorrencias_classificacao.find((o: any) => o.value === ocorrencia.classificacao)?.label}
                    </Text>
                </View>
            </View>
            <View style={styles.row}>
                <View style={styles.cell}><Text><Text style={styles.label}>Local:</Text> {nomeEscola}</Text></View>
                <View style={[styles.cell, styles.lastCell]}>
                    <Text><Text style={styles.label}>Acionamento:</Text> {ocorrencias_acionamento.find((o: any) => o.value === ocorrencia.acionamento)?.label}</Text>
                </View>
            </View>
        </View>

        {/* Histórico */}
        <View style={styles.section}>
            <Text style={styles.label}>Descrição da Ocorrência:</Text>
            <View style={styles.textareaBox}>
                <Text>{ocorrencia.descricao || 'Sem descrição informada.'}</Text>
            </View>
        </View>

        {/* Rodapé */}
        <Text style={styles.footer}>Macapá-AP, {dataAtual}.</Text>
        </Page>

      </Document>
    );
  }
  