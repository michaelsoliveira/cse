export const CellDate = ({ data }: { data: any }) => {
    const date = new Date(data)
    return new Intl.DateTimeFormat('pt-BR').format(date);

}