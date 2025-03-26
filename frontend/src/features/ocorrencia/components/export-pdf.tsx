'use client'
import invoice from '@/services/invoice'
import dynamic from 'next/dynamic'


const Invoice = dynamic(() => import('@/components/reports/Invoice'), {ssr: false})

const ExportPDFIndex = () => {
    return (
        <>
            <div className='flex items-center justify-center w-full my-10'>
                <Invoice invoice={invoice} />
            </div>
        </>
    )
}

export default ExportPDFIndex