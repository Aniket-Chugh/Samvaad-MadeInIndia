const cokkieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 15 // 15 minutes
};

export default cokkieOptions
