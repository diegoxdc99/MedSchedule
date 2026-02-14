export default function BackgroundDecoration() {
    return (
        <div
            aria-hidden="true"
            className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none"
        >
            <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/10 dark:bg-blue-600/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-600/5 dark:bg-blue-900/10 rounded-full blur-[100px]" />
        </div>
    )
}
