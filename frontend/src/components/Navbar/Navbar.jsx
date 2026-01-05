import React, { useContext } from 'react'
import MobileNavbar from './MobileNavbar'
import DesktopNavbar from './DesktopNavbar'
import { storeContext } from '../../Context/Context'
import Authentication from '../../Authentication/Authentication'

import ProfileModal from './ProfileModal'
import ProfileDropdown from './ProfileDropdown'
import UserCartModal from '../../AllPopupPages/UserCartModal'

const Navbar = () => {

    const { showAuthenticationPopup, userProfilePopup, userCartModal } = useContext(storeContext)
console.log('setUserCartModal', userCartModal)
    return (
        <div className='sticky top-0 left-0 bg-white z-20'>
            {/* Mobile or Desktop Navbar */}
            <div className="lg:hidden">
                <MobileNavbar />
            </div>
            <div className="hidden lg:flex">
                <DesktopNavbar />
            </div>

            {/* Authentication modal */}
            {showAuthenticationPopup && <Authentication />}

            {/* Profile modal */}
            {userProfilePopup &&
                <div>
                    <div className="lg:hidden ">
                        <ProfileModal />
                    </div>

                    <div className="hidden lg:flex">
                        <ProfileDropdown />
                    </div>
                </div>
            }

            {/* User cart modal */}
            { userCartModal && <UserCartModal />}
        </div>
    )
}

export default Navbar