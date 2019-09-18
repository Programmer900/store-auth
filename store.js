import firebase from 'firebase'

export default {
    state: {
        user: {
            isAuth: false,
            uid: null
        }
    },
    mutations: {
        setUser(state, payload) {
            state.user.isAuth = true
            state.user.uid = payload
        },
        unSetUser(state) {
            state.user = {
                isAuth: false,
                uid: null
            }
        }
    },
    actions: {
        async signUp({commit}, {email, password}) {
            commit('clearError')
            commit('setProcessing', true)
            try {
                const user = await firebase.auth().createUserWithEmailAndPassword(email, password)
                commit('setProcessing', false)
                commit('setUser', user.user.uid)
                commit('clearError')
            }
            catch (error) {
                console.log('Ошибочка', error)
                commit('setProcessing', false)
                commit('setError', error.message)
                throw error
            }
        },
        async signIn({commit}, {email, password}) {
            commit('clearError')
            commit('setProcessing', true)
            try {
                const user = await firebase.auth().signInWithEmailAndPassword(email, password)
                commit('setProcessing', false)
                commit('setUser', user.user.uid)
                commit('clearError')
            }
            catch (error) {
                commit('setProcessing', false)
                commit('setError', error.message)
                commit('messageError', error.message)
                throw error
            }
        },
        stateChanged({commit}, user) {
            commit('setUser', user.uid)
        },
        signOut({commit}) {
            firebase.auth().signOut()
            commit('unSetUser')
        }
    },
    getters: {
        isAuth: (state) => state.user.isAuth
    }
}