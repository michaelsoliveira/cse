import { UnidadeEscolarType } from "types";

type UnidadeDetailsProps = {
    data: UnidadeEscolarType
}

const UnidadeDetails = ({ data }: any) => {
    return (
        <div>
            <pre>
                {JSON.stringify(data, null, 2)}
            </pre>
        </div>
    )
}

export default UnidadeDetails