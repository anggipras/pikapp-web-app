import React from "react";
import '../../Asset/scss/PaymentModal.scss'
import closeLogo from '../../Asset/Icon/close.png';

const PaymentModal = (props) => {

    const closeModal = (e) => {
        e.stopPropagation()
        props.onHidePaymentModal()
    }

    return (
        <div className='modalMenuDetail-payment' style={{
            display: props.isShowPaymentModal ? 'block' : 'none'
        }} onClick={closeModal}
        >
            <div className='modal-content-menudetail-payment' onClick={e => e.stopPropagation()}>
                {
                    <span className='iconClose-payment' onClick={closeModal}>
                        <img src={closeLogo} className='closeLogo-payment' alt='' />
                    </span>
                }

                <div className='menuDetail-layout-payment'>
                    <div className='menuContain-all-payment'>

                        <div className='menu-detail-payment'>
                            <div className='menu-name-payment'>
                                Pembayaran melalui OVO 
                            </div>

                            <div className='mob-menu-category-payment'>
                                1. Pastikan nomor telepon yang Anda daftarkan di PikApp terdaftar di OVO 
                                <br />2. Notifikasi pembayaran akan muncul di aplikasi OVO Anda. Jika tidak, buka aplikasi OVO Anda
                                <br />3. Klik notifikasi
                                <br />4. Pilih “Pikafood”
                                <br />5. Ikuti langkah selanjutnya
                                <br />6. Jika transaksi pembayaran lebih dari Rp100 ribu, kamu harus mengonfirmasinya dengan password.
                            </div>

                            <div className='menu-name-payment'>
                                Pembayaran melalui Kasir 
                            </div>

                            <div className='mob-menu-category-payment'>
                                1. Tunjukkan halaman ini ke kasir
                                <br />2. Lakukan transaksi dengan pilihan pembayaran favorit Anda
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PaymentModal