import gtk
import webkit
import gobject

gobject.threads_init()
win = gtk.Window()
bro = webkit.WebView()
bro.open("http://127.0.0.1:8080")
win.add(bro)
win.show_all()
gtk.main()