function Loading() {

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">

            <div className="text-center">

                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#00ADB5] mx-auto"></div>

                <p className="mt-4 text-gray-600">
                    Loading...
                </p>

            </div>

        </div>
    );

}

export default Loading;