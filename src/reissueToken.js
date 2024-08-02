import axios from "axios";

async function reissueToken(err) {
    const refreshToken = localStorage.getItem('refreshToken');
    delete axios.defaults.headers.common['Authorization'];
    delete axios.defaults.headers.common['Refresh'];
    try{
        const refreshResponse = await axios.post('/api/users/reissue-token', { refreshToken : refreshToken });
        console.log(refreshResponse);
        const accessToken = refreshResponse.data.data.accessToken;
        const newRefreshToken = refreshResponse.data.data.refreshToken;
        if(refreshResponse.data.statusCode === 200) {
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', newRefreshToken); 
            window.location.reload();
        }
    } catch(err) {
        console.log(err);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = "/login";
    }
}

export default reissueToken;