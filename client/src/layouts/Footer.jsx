import React from 'react'

const Footer = () => {
    return (
        <footer className='w-full py-4 text-center text-gray-600'>
            &copy; {new Date().getFullYear()} <strong>PromptStack</strong> — Built with love by Trish 💜
        </footer>
    )
}

export default Footer
