// components/pdf/UnidadeEscolarPdf.tsx
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Font
  } from '@react-pdf/renderer'
import { UnidadeDetailsTypeProps } from '../unidade-details'
  
  // Estilo moderno com "tabela"
  const styles = StyleSheet.create({
    page: {
      padding: 32,
      fontSize: 12,
      fontFamily: 'Helvetica',
    },
    section: {
      marginBottom: 16,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 12,
    },
    label: {
      fontWeight: 'bold',
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
      marginBottom: 4,
    },
    columnLeft: {
      width: '35%',
    },
    columnRight: {
      width: '65%',
    },
    divider: {
      marginVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    }
  })
  
  type UnidadeEscolarPdfProps = {
    data: UnidadeDetailsTypeProps['data']
  }
  
  export const UnidadeEscolarPdf = ({ data }: any) => {
  
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.title}>{data.pessoa?.pessoaJuridica?.nome_fantasia}</Text>
            <View style={styles.row}>
              <Text style={styles.columnLeft}>INEP:</Text>
              <Text style={styles.columnRight}>{data?.inep ?? 'Não informado'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.columnLeft}>Zona:</Text>
              <Text style={styles.columnRight}>{data?.zona ?? 'Não informada'}</Text>
            </View>
          </View>
  
          <View style={styles.divider} />
  
          <View style={styles.section}>
            <Text style={styles.label}>Contato</Text>
            <View style={styles.row}>
              <Text style={styles.columnLeft}>Telefone:</Text>
              <Text style={styles.columnRight}>{data?.telefone ?? 'Não informado'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.columnLeft}>Email:</Text>
              <Text style={styles.columnRight}>{data?.email ?? 'Não informado'}</Text>
            </View>
          </View>
  
          <View style={styles.divider} />
  
          <View style={styles.section}>
            <Text style={styles.label}>Endereço</Text>
            <View style={styles.row}>
              <Text style={styles.columnLeft}>Logradouro:</Text>
              <Text style={styles.columnRight}>{data.pessoa.endereco?.logradouro}, {data.pessoa.endereco?.numero}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.columnLeft}>Bairro:</Text>
              <Text style={styles.columnRight}>{data.pessoa.endereco?.bairro}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.columnLeft}>Município:</Text>
              <Text style={styles.columnRight}>{data.pessoa.endereco?.municipio?.nome}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.columnLeft}>Estado:</Text>
              <Text style={styles.columnRight}>{data.pessoa.endereco?.estado?.nome}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.columnLeft}>CEP:</Text>
              <Text style={styles.columnRight}>{data.pessoa.endereco?.cep}</Text>
            </View>
          </View>
  
          <View style={styles.divider} />
  
          <View style={styles.section}>
            <Text style={styles.label}>Diretor(a)</Text>
            <View style={styles.row}>
              <Text style={styles.columnLeft}>Nome:</Text>
              <Text style={styles.columnRight}>{data.diretor?.pessoa?.pessoaFisica?.nome}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.columnLeft}>RG:</Text>
              <Text style={styles.columnRight}>{data.diretor?.pessoa?.pessoaFisica?.rg}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.columnLeft}>CPF:</Text>
              <Text style={styles.columnRight}>{data.diretor?.pessoa?.pessoaFisica?.cpf}</Text>
            </View>
          </View>
        </Page>
      </Document>
    )
  }
  