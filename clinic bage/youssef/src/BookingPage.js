import React from 'react';

function BookingPage({ onBack }) {
    // Styles for the booking page (English/LTR)
    const bookingStyles = {
        page: {
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #e0f2fe, #f0fdfa)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            fontFamily: '"Poppins", sans-serif', // Changed to a font suitable for English
        },
        card: {
            background: 'white',
            width: '100%',
            maxWidth: '500px',
            padding: '40px',
            borderRadius: '15px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            position: 'relative',
            textAlign: 'left', // Changed from right to left for English
        },
        backBtn: {
            position: 'absolute',
            top: '15px',
            left: '15px', // Changed from right to left
            background: '#f1f5f9',
            border: 'none',
            padding: '8px 15px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 'bold',
            color: '#475569',
        },
        title: {
            textAlign: 'center',
            color: '#0891b2',
            marginBottom: '10px',
            fontSize: '2rem',
        },
        subtitle: {
            textAlign: 'center',
            color: '#64748b',
            marginBottom: '30px',
        },
        inputGroup: {
            marginBottom: '15px',
        },
        label: {
            display: 'block',
            marginBottom: '5px',
            fontWeight: 'bold',
            color: '#334155',
        },
        input: {
            width: '100%',
            padding: '12px',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            fontFamily: '"Poppins", sans-serif',
            fontSize: '1rem',
        },
        submitBtn: {
            width: '100%',
            padding: '12px',
            background: '#0891b2',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginTop: '10px',
        }
    };

    return ( <
        div style = { bookingStyles.page } >
        <
        div style = { bookingStyles.card } >
        <
        button style = { bookingStyles.backBtn }
        onClick = { onBack } > ←Back <
        /button>

        <
        h2 style = { bookingStyles.title } > Book Appointment < /h2> <
        p style = { bookingStyles.subtitle } > Please fill in the following details < /p>

        <
        form onSubmit = {
            (e) => {
                e.preventDefault();
                alert('Booking successful! We will contact you soon.');
                onBack();
            }
        } >
        <
        div style = { bookingStyles.inputGroup } >
        <
        label style = { bookingStyles.label } > Full Name < /label> <
        input type = "text"
        placeholder = "Enter your name"
        style = { bookingStyles.input }
        required / >
        <
        /div>

        <
        div style = { bookingStyles.inputGroup } >
        <
        label style = { bookingStyles.label } > Phone Number < /label> <
        input type = "tel"
        placeholder = "01xxxxxxxxx"
        style = { bookingStyles.input }
        required / >
        <
        /div>

        <
        div style = { bookingStyles.inputGroup } >
        <
        label style = { bookingStyles.label } > Required Service < /label> <
        select style = { bookingStyles.input }
        required >
        <
        option value = "" > Select Service < /option> <
        option value = "hollywood" > Hollywood Smile < /option> <
        option value = "implant" > Dental Implants < /option> <
        option value = "ortho" > Orthodontics < /option> <
        option value = "checkup" > General Checkup < /option> < /
        select > <
        /div>

        <
        button type = "submit"
        style = { bookingStyles.submitBtn } > Confirm Booking < /button> < /
        form > <
        /div> < /
        div >
    );
}

export default BookingPage;